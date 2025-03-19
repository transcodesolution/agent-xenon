import { useState, useRef, useEffect } from "react";
import { Group, Stack, Title, Button, Grid, Flex, Text } from "@mantine/core";
import { IconCode, IconPlayerPlay, IconRefresh } from "@tabler/icons-react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Terminal } from "./Terminal";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { LanguageSelector } from "./LanguageSelector";
import { terminalStyles } from "@/libs/utils/ui-helpers";
import { useCodeExecute } from "@agent-xenon/react-query-hooks";
import { compilerVersionAndLanguages } from "@agent-xenon/resources";

const addTerminalStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.textContent = terminalStyles;
  document.head.appendChild(styleElement);

  return () => {
    if (document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  };
};

interface ICodeQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export function CodeQuestion({ question, answer, onAnswer }: ICodeQuestion) {
  const [codeValue, setCodeValue] = useState(answer || "");
  const [language, setLanguage] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);
  const { mutate: codeExecute } = useCodeExecute()

  useEffect(() => {
    addTerminalStyles();
  }, []);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRun = () => {
    const languageConfig = compilerVersionAndLanguages.find(
      (l) => l.language === language
    );
    if (!languageConfig) return;

    setIsRunning(true);
    codeExecute(
      {
        code: codeValue,
        language: language,
        version: languageConfig.version,
      },
      {
        onSuccess: (response) => {
          setIsRunning(false);
          if (response?.data?.output) {
            const outputLines = response.data.output.split("\n").filter(line => line.trim() !== "");
            setTerminalOutput(["$ Testing your solution...", ...outputLines]);
          } else {
            setTerminalOutput(["$ No output received."]);
          }
        },
        onError: (error) => {
          setTerminalOutput([
            `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
          ]);
          setIsRunning(false);
        },
      }
    );
  };

  const handleReset = () => {
    setCodeValue(answer || "");
    setTerminalOutput([]);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeValue(value)
      onAnswer?.(question._id, codeValue)
    }
  }

  return (
    <Stack>
      <Grid >
        <Grid.Col span={4} >
          <Stack align="center" h="calc(100vh - 185px)" gap="md" styles={{
            root: {
              overflow: "auto"
            }
          }}>
            <Flex gap='md'>
              <IconCode size={28} />
              <Title order={3}> {question.question}</Title>
            </Flex>
            <Text c='gray' dangerouslySetInnerHTML={{ __html: question.description }} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap="sm">
            <Flex justify="space-between" align='end' gap="md">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
                editorTheme={editorTheme}
                onThemeChange={setEditorTheme}
              />
              <Group>
                <Button
                  size="sm"
                  variant="light"
                  color="blue"
                  onClick={handleRun}
                  loading={isRunning}
                  leftSection={<IconPlayerPlay size={16} />}
                >
                  Run
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  color="gray"
                  onClick={handleReset}
                  leftSection={<IconRefresh size={16} />}
                >
                  Reset
                </Button>
              </Group>
            </Flex>
            <Editor
              height="360px"
              theme={editorTheme}
              language={language}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              value={codeValue}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
                fontLigatures: true,
                automaticLayout: true,
                lineNumbers: 'on',
                roundedSelection: false,
                contextmenu: true,
                cursorBlinking: 'blink',
              }}
            />
            <Terminal output={terminalOutput} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}