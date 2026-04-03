import { Table, Text, Flex } from "@mantine/core";

interface Conjugation {
  catalan: string;
  german: string;
}

interface ConjugationForms {
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

// Left column = singular, right column = plural
const ROWS: [keyof ConjugationForms, keyof ConjugationForms][] = [
  ["jo", "nosaltres"],
  ["tu", "vosaltres"],
  ["ellElla", "ellsElles"],
];

export function VerbBlock({ word }: { word: VerbWord }) {
  return (
    <Flex align="center" style={{ height: "100%" }}>
      <Table
        withTableBorder={false}
        withRowBorders={false}
        withColumnBorders={false}
        horizontalSpacing={8}
        verticalSpacing={3}
        style={{ tableLayout: "fixed" }}
      >
        <Table.Tbody>
          {ROWS.map(([leftKey, rightKey]) => (
            <Table.Tr key={leftKey}>
              <Table.Td style={{ textAlign: "right", borderRight: "1px solid #ddd" }}>
                <Text className="vocab-word" fw={600}>
                  {word.conjugations[leftKey].catalan}
                </Text>
              </Table.Td>
              <Table.Td style={{ borderRight: "1px solid #eee" }}>
                <Text className="vocab-word">
                  {word.conjugations[leftKey].german}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: "right", borderRight: "1px solid #ddd" }}>
                <Text className="vocab-word" fw={600}>
                  {word.conjugations[rightKey].catalan}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text className="vocab-word">
                  {word.conjugations[rightKey].german}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}
