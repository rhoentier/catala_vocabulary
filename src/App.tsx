import { Fragment, useEffect, useState } from "react";
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
import { List, FilePdf } from "@phosphor-icons/react";
import { pdf } from "@react-pdf/renderer";
import { NomenRow } from "./components/Nomen";
import { VerbBlock } from "./components/Verb";
import { SimpleWordRow } from "./components/SimpleWord";
import { VocabularyPdf } from "./components/VocabularyPdf";
import type { VocabularyData } from "./types";
import "./App.css";

const vocabModules = import.meta.glob<VocabularyData>(
  "../data/vocabulary/*.json",
  { eager: true, import: "default" },
);
const allCategories = Object.values(vocabModules);

const DESKTOP_BP = 800;

function useIsDesktop() {
  const [desktop, setDesktop] = useState(window.innerWidth >= DESKTOP_BP);
  useEffect(() => {
    const update = () => setDesktop(window.innerWidth >= DESKTOP_BP);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return desktop;
}

function App() {
  const desktop = useIsDesktop();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<VocabularyData>(allCategories[0]);

  const words = current.words;

  const [generating, setGenerating] = useState(false);

  const selectCategory = (cat: VocabularyData) => {
    setCurrent(cat);
    close();
  };

  const handleDownloadPdf = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(<VocabularyPdf data={current} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${current.category}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="category-menu">
        <ActionIcon
          variant="filled"
          color="#aa3bff"
          size="xl"
          radius="xl"
          onClick={open}
          aria-label="Kategorien"
        >
          <List size={22} weight="bold" />
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="#aa3bff"
          size="xl"
          radius="xl"
          onClick={handleDownloadPdf}
          loading={generating}
          aria-label="PDF herunterladen"
        >
          <FilePdf size={22} weight="bold" />
        </ActionIcon>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Kategorie wählen"
        centered
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
      <Paper
        className="a4"
        shadow={desktop ? "lg" : undefined}
        radius={desktop ? "md" : 0}
      >
        <Stack
          gap={0}
          pt={17}
          pr={17}
          pl={17}
          pb={39}
          style={{
            minHeight: desktop ? undefined : "100vh",
            boxSizing: "border-box",
          }}
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
                ) : (
                  <SimpleWordRow word={word} />
                );
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
