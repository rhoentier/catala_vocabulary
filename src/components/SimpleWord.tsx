import { Text, Flex, Divider } from "@mantine/core";
import type { SimpleWord } from "../types";

export type { SimpleWord };

export function SimpleWordRow({ word }: { word: SimpleWord }) {
  return (
    <Flex align="center" justify="center" style={{ height: "100%" }}>
      <Text
        className="vocab-word"
        fw={600}
        ta="right"
        px={8}
        style={{ flex: 1 }}
      >
        {word.translation.catalan}
      </Text>
      <Divider orientation="vertical" color="#ddd" my={6} />
      <Text
        className="vocab-word"
        fw={500}
        px={8}
        style={{ flex: 1 }}
      >
        {word.translation.german}
      </Text>
    </Flex>
  );
}
