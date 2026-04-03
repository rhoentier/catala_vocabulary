import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  VocabularyData,
  NounWord,
  VerbWord,
  SimpleWord,
  ConjugationForms,
} from "../types";

const ACCENT = "#aa3bff";
const DIVIDER_COLOR = "#f0ebe3";
const WORDS_PER_PAGE = 10;

const styles = StyleSheet.create({
  page: {
    paddingTop: 17,
    paddingRight: 17,
    paddingLeft: 17,
    paddingBottom: 39,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    borderLeftWidth: 6,
    borderLeftColor: ACCENT,
    borderLeftStyle: "solid",
    paddingLeft: 17,
    marginBottom: 11,
  },
  headerLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER_COLOR,
    marginHorizontal: 11,
  },
  wordBlock: {
    flex: 1,
    justifyContent: "center",
  },
  // Noun styles
  nounRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nounHalf: {
    flex: 1,
    paddingHorizontal: 8,
  },
  nounVerticalDivider: {
    width: 1,
    backgroundColor: "#ddd",
    alignSelf: "stretch",
    marginVertical: 6,
  },
  nounCatalan: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  nounGerman: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  nounPlural: {
    fontSize: 8,
    color: "#868e96",
  },
  // Verb styles
  verbRow: {
    flexDirection: "row",
  },
  verbCell: {
    width: "25%",
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  verbCatalanText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  verbGermanText: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  verbBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
  },
  verbBorderRightLight: {
    borderRightWidth: 1,
    borderRightColor: "#eee",
    borderRightStyle: "solid",
  },
  // Simple word styles
  simpleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  simpleHalf: {
    flex: 1,
    paddingHorizontal: 8,
  },
  simpleCatalan: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  simpleGerman: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
});

const VERB_ROWS: [keyof ConjugationForms, keyof ConjugationForms][] = [
  ["jo", "nosaltres"],
  ["tu", "vosaltres"],
  ["ellElla", "ellsElles"],
];

function PdfNounRow({ word }: { word: NounWord }) {
  return (
    <View style={[styles.wordBlock, styles.nounRow]}>
      <View style={styles.nounHalf}>
        <Text style={styles.nounCatalan}>
          {word.forms.singular.catalan}
          <Text style={styles.nounPlural}>
            {" "}/ {word.forms.plural.catalan}
          </Text>
        </Text>
      </View>
      <View style={styles.nounVerticalDivider} />
      <View style={styles.nounHalf}>
        <Text style={styles.nounGerman}>
          {word.forms.singular.german}
          <Text style={styles.nounPlural}>
            {" "}/ {word.forms.plural.german}
          </Text>
        </Text>
      </View>
    </View>
  );
}

function PdfSimpleWordRow({ word }: { word: SimpleWord }) {
  return (
    <View style={[styles.wordBlock, styles.simpleRow]}>
      <View style={styles.simpleHalf}>
        <Text style={styles.simpleCatalan}>
          {word.translation.catalan}
        </Text>
      </View>
      <View style={styles.nounVerticalDivider} />
      <View style={styles.simpleHalf}>
        <Text style={styles.simpleGerman}>
          {word.translation.german}
        </Text>
      </View>
    </View>
  );
}

function PdfVerbBlock({ word }: { word: VerbWord }) {
  return (
    <View style={styles.wordBlock}>
      {VERB_ROWS.map(([leftKey, rightKey]) => (
        <View style={styles.verbRow} key={leftKey}>
          <View style={[styles.verbCell, styles.verbBorderRight]}>
            <Text style={styles.verbCatalanText}>
              {word.conjugations[leftKey].catalan}
            </Text>
          </View>
          <View style={[styles.verbCell, styles.verbBorderRightLight]}>
            <Text style={styles.verbGermanText}>
              {word.conjugations[leftKey].german}
            </Text>
          </View>
          <View style={[styles.verbCell, styles.verbBorderRight]}>
            <Text style={styles.verbCatalanText}>
              {word.conjugations[rightKey].catalan}
            </Text>
          </View>
          <View style={styles.verbCell}>
            <Text style={styles.verbGermanText}>
              {word.conjugations[rightKey].german}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function VocabularyPdf({ data }: { data: VocabularyData }) {
  const pages: VocabularyData["words"][] = [];
  for (let i = 0; i < data.words.length; i += WORDS_PER_PAGE) {
    pages.push(data.words.slice(i, i + WORDS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((pageWords, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerLabel}>Vokabular</Text>
            <Text style={styles.headerTitle}>{data.category}</Text>
          </View>

          <View style={styles.divider} />

          <View style={{ flex: 1 }}>
            {pageWords.map((word, i) => (
              <View key={i} wrap={false} style={{ flex: 1 }}>
                {word.wordType === "noun" ? (
                  <PdfNounRow word={word} />
                ) : word.wordType === "verb" ? (
                  <PdfVerbBlock word={word} />
                ) : (
                  <PdfSimpleWordRow word={word} />
                )}
                {i < pageWords.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
}
