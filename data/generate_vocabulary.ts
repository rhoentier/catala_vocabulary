#!/usr/bin/env tsx
import "dotenv/config";
import OpenAI from "openai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new OpenAI({
  baseURL: "https://api.iteragpt.iteratec.de/v1",
  apiKey: process.env.LITELLM_API_KEY || "no-key",
});

const MODEL = process.env.LITELLM_MODEL ?? "no-model";

const FormSchema = z.object({
  catalan: z.string(),
  german: z.string(),
});

const NomenSchema = z.object({
  wordType: z.literal("noun"),
  forms: z.object({
    singular: FormSchema,
    plural: FormSchema,
  }),
});

const VerbSchema = z.object({
  wordType: z.literal("verb"),
  conjugations: z.object({
    jo: FormSchema,
    tu: FormSchema,
    ellElla: FormSchema,
    nosaltres: FormSchema,
    vosaltres: FormSchema,
    ellsElles: FormSchema,
  }),
});

const WordSchema = z.discriminatedUnion("wordType", [NomenSchema, VerbSchema]);

const VocabularySchema = z.object({
  category: z.string(),
  words: z.array(WordSchema),
});

type Vocabulary = z.infer<typeof VocabularySchema>;

async function generateVocabulary(category: string): Promise<Vocabulary> {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content:
          `Create a vocabulary list with the 10 most important words ` +
          `for the category "${category}". ` +
          `Mix all word types! It shouldn’t just be one part of speech followed by another; instead, it should be, for example, two nouns, then a verb, then an adjective, and then another noun. It shouldn’t just be one part of speech followed by another; instead, it should be, for example, two nouns, then a verb, then an adjective, and then another noun.` +
          `Each word should be given in Catalan and German.`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "save_vocabulary",
          description: "Saves a structured vocabulary list for a category.",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Name of the category",
              },
              words: {
                type: "array",
                description: "List of vocabulary words",
                items: {
                  oneOf: [
                    {
                      type: "object",
                      description: "A noun with singular and plural forms",
                      properties: {
                        wordType: { type: "string", enum: ["noun"] },
                        forms: {
                          type: "object",
                          properties: {
                            singular: {
                              type: "object",
                              description: "Singular form",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            plural: {
                              type: "object",
                              description: "Plural form",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                          },
                          required: ["singular", "plural"],
                        },
                      },
                      required: ["wordType", "forms"],
                    },
                    {
                      type: "object",
                      description:
                        "A verb with all 6 conjugations in Catalan and German",
                      properties: {
                        wordType: { type: "string", enum: ["verb"] },
                        conjugations: {
                          type: "object",
                          properties: {
                            jo: {
                              type: "object",
                              description: "1st person singular (ich)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            tu: {
                              type: "object",
                              description: "2nd person singular (du)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            ellElla: {
                              type: "object",
                              description: "3rd person singular (er/sie/es)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            nosaltres: {
                              type: "object",
                              description: "1st person plural (wir)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            vosaltres: {
                              type: "object",
                              description: "2nd person plural (ihr)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                            ellsElles: {
                              type: "object",
                              description: "3rd person plural (sie)",
                              properties: {
                                catalan: { type: "string" },
                                german: { type: "string" },
                              },
                              required: ["catalan", "german"],
                            },
                          },
                          required: [
                            "jo",
                            "tu",
                            "ellElla",
                            "nosaltres",
                            "vosaltres",
                            "ellsElles",
                          ],
                        },
                      },
                      required: ["wordType", "conjugations"],
                    },
                  ],
                },
              },
            },
            required: ["category", "words"],
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "save_vocabulary" } },
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("Unexpected response format from the API.");
  }

  return VocabularySchema.parse(JSON.parse(toolCall.function.arguments));
}

async function main() {
  const category = process.argv[2];

  if (!category) {
    console.error("Error: No category provided.");
    console.error("");
    console.error("Usage:    tsx data/generate_vocabulary.ts <category>");
    console.error("Example:  tsx data/generate_vocabulary.ts kitchen");
    process.exit(1);
  }

  console.log(`Generating vocabulary for: "${category}" ...`);

  const vocabulary = await generateVocabulary(category);

  const outputDir = path.join(__dirname, "vocabulary");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${category.toLowerCase().replace(/\s+/g, "_")}.json`;
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2), "utf-8");

  console.log(`${vocabulary.words.length} words generated`);
  console.log(`Saved: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
