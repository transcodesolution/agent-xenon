import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Grid, Stack, Text, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

interface ITextQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const TextQuestion = ({ question, answer, onAnswer }: ITextQuestion) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(answer || "");
  }, [answer]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.currentTarget.value;
    setText(newText);
    onAnswer(question._id, newText);
  };

  return (
    <Grid>
      {question.description?.trim() && (
        <Grid.Col span={4}>
          <Stack align="center" h="calc(100vh - 185px)" gap="md" styles={{ root: { overflow: "auto" } }}>
            <Text c="gray" dangerouslySetInnerHTML={{ __html: question.description }} />
          </Stack>
        </Grid.Col>
      )}
      <Grid.Col span={question.description?.trim() ? 8 : 12}>
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type your answer here..."
          minRows={8}
          maxRows={8}
          radius="md"
          resize="vertical"
        />
      </Grid.Col>
    </Grid>
  );
};
