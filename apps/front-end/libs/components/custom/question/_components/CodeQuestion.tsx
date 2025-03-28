import { useState, useRef, useEffect } from "react";
import { Group, Stack, Button, Grid, Flex, Text } from "@mantine/core";
import { IconPlayerPlay, IconRefresh } from "@tabler/icons-react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Terminal } from "./Terminal";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { LanguageSelector } from "./LanguageSelector";
import { useCodeExecute } from "@agent-xenon/react-query-hooks";
import { compilerVersionAndLanguages } from "@agent-xenon/resources";

interface ICodeQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export function CodeQuestion({ question, answer, onAnswer }: ICodeQuestion) {
  const [codeValue, setCodeValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { mutate: codeExecute } = useCodeExecute()

  useEffect(() => {
    setCodeValue(answer || "");
  }, [answer]);

  const handleRun = () => {
    const languageConfig = compilerVersionAndLanguages.find(
      (l) => l.language === language
    );
    if (!languageConfig) return;

    setIsRunning(true);
    setTerminalOutput((prevOutput) => [...prevOutput, "$ Running Code..."]);
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
            setTerminalOutput((prevOutput) => [
              ...prevOutput,
              ...outputLines
            ]);
          } else {
            setTerminalOutput((prevOutput) => [
              ...prevOutput,
              "$ No output received."
            ]);
          }
        },
        onError: (error) => {
          setTerminalOutput((prevOutput) => [
            ...prevOutput,
            `✗ Error: ${error instanceof Error ? error.message : String(error)}`
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
    <Grid >
      {question.description?.trim() && (
        <Grid.Col span={4}>
          <Stack align="center" h="calc(100vh - 185px)" gap="md" styles={{ root: { overflow: "auto" } }}>
            <Text c="gray" dangerouslySetInnerHTML={{ __html: question.description }} />
          </Stack>
        </Grid.Col>
      )}
      <Grid.Col span={question.description?.trim() ? 8 : 12}>
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
  );
}