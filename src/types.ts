interface NounForms {
  singular: { catalan: string; german: string };
  plural: { catalan: string; german: string };
}

export interface NounWord {
  wordType: "noun";
  forms: NounForms;
}

interface Conjugation {
  catalan: string;
  german: string;
}

export interface ConjugationForms {
  jo: Conjugation;
  tu: Conjugation;
  ellElla: Conjugation;
  nosaltres: Conjugation;
  vosaltres: Conjugation;
  ellsElles: Conjugation;
}

export interface VerbWord {
  wordType: "verb";
  conjugations: ConjugationForms;
}

export interface SimpleWord {
  wordType: "adjective" | "adverb" | "preposition" | "conjunction";
  translation: { catalan: string; german: string };
}

export type AnyWord = NounWord | VerbWord | SimpleWord;

export interface VocabularyData {
  category: string;
  words: AnyWord[];
}
