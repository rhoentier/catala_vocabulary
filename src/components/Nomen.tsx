import { Text, Flex, Divider } from "@mantine/core";

interface NounForms {
  singular: { catalan: string; german: string };
  plural: { catalan: string; german: string };
}

export interface NounWord {
  wordType: "noun";
  forms: NounForms;
}

export function NomenRow({ word }: { word: NounWord }) {
  return (
    <Flex align="center" justify="center" style={{ height: "100%" }}>
      <Text
        className="vocab-word"
        fw={600}
        ta="right"
        px={8}
        style={{ flex: 1 }}
      >
        {word.forms.singular.catalan}
        <Text span className="vocab-plural" c="dimmed">
          {" "}
          / {word.forms.plural.catalan}
        </Text>
      </Text>
      <Divider orientation="vertical" color="#ddd" my={6} />
      <Text
        className="vocab-word"
        fw={500}
        px={8}
        style={{ flex: 1 }}
      >
        {word.forms.singular.german}
        <Text span className="vocab-plural" c="dimmed">
          {" "}
          / {word.forms.plural.german}
        </Text>
      </Text>
    </Flex>
  );
}
