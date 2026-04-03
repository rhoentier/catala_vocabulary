import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Grid,
  Title,
  Text,
  Divider,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NomenRow, type NounWord } from "./components/Nomen";
import { VerbBlock, type VerbWord } from "./components/Verb";
import "./App.css";

type AnyWord = NounWord | VerbWord;
interface VocabularyData {
  category: string;
  words: AnyWord[];
}

const vocabModules = import.meta.glob<VocabularyData>(
  "../data/vocabulary/*.json",
  { eager: true, import: "default" },
);
const allCategories = Object.values(vocabModules);

// A4 at 96 dpi
const A4_H = 1123;
const A4_W = 794;

function useA4Zoom() {
  const calc = useCallback(() => {
    const sh = (window.innerHeight * 0.9) / A4_H;
    const sw = (window.innerWidth * 0.9) / A4_W;
    return Math.min(sh, sw);
  }, []);
  const [zoom, setZoom] = useState(calc);
  useEffect(() => {
    const update = () => setZoom(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [calc]);
  return zoom;
}

function App() {
  const zoom = useA4Zoom();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<VocabularyData>(allCategories[0]);

  const words = current.words;

  const selectCategory = (cat: VocabularyData) => {
    setCurrent(cat);
    close();
  };

  return (
    <div className="page-bg">
      <div className="category-menu no-print">
        <ActionIcon
          variant="filled"
          color="#aa3bff"
          size="xl"
          radius="xl"
          onClick={open}
          aria-label="Kategorien"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </ActionIcon>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Kategorie wählen"
        centered
        className="no-print"
        styles={{
          title: { fontWeight: 700, fontSize: "1.1rem" },
        }}
      >
        <Stack gap="xs">
          {allCategories.map((cat) => (
            <Button
              key={cat.category}
              color="#aa3bff"
              fullWidth
              justify="flex-start"
              onClick={() => selectCategory(cat)}
            >
              {cat.category}
            </Button>
          ))}
        </Stack>
      </Modal>

      {/* ── A4 paper ── */}
      <Paper className="a4" shadow="lg" radius="md" style={{ zoom }}>
        <Stack
          gap={0}
          pt={17}
          pr={17}
          pl={17}
          pb={39}
          style={{ height: "100%", boxSizing: "border-box" }}
        >
          <Grid
            mb={11}
            gap={0}
            style={{
              borderLeft: "6px solid #aa3bff",
              paddingLeft: 17,
              flexShrink: 0,
            }}
          >
            <Grid.Col span={12}>
              <Text
                fz="0.97rem"
                fw={700}
                c="#aa3bff"
                tt="uppercase"
                style={{ letterSpacing: "0.12em" }}
              >
                Vokabular
              </Text>
              <Title
                order={2}
                fz="1.53rem"
                fw={700}
                c="#1a1a1a"
                style={{ margin: 0 }}
              >
                {current.category}
              </Title>
            </Grid.Col>
          </Grid>

          <Divider color="#f0ebe3" mx={11} />

          <Grid
            gap={0}
            style={{ flex: 1, minHeight: 0 }}
            styles={{ inner: { flexDirection: "column", height: "100%" } }}
          >
            {words.map((word, i) => {
              const content =
                word.wordType === "noun" ? (
                  <NomenRow word={word} />
                ) : word.wordType === "verb" ? (
                  <VerbBlock word={word} />
                ) : null;
              return (
                <Fragment key={i}>
                  <Grid.Col span={12} style={{ flex: 1, minHeight: 0 }}>
                    {content}
                  </Grid.Col>
                  {i < words.length - 1 && (
                    <Grid.Col span={12} style={{ flex: "none" }}>
                      <Divider color="#f0ebe3" mx={11} />
                    </Grid.Col>
                  )}
                </Fragment>
              );
            })}
          </Grid>
        </Stack>
      </Paper>
    </div>
  );
}

export default App;
