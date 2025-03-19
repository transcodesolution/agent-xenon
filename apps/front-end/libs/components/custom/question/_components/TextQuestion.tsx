import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Divider, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { useState, useEffect } from "react";

interface ITextQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const TextQuestion = ({ question, answer, onAnswer }: ITextQuestion) => {
  const [text, setText] = useState(answer || "");

  useEffect(() => {
    setText(answer || "");
  }, [answer]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.currentTarget.value;
    setText(newText);
    onAnswer(question._id, newText);
  };

  return (
    <Stack>
      <Group align="center" gap="md">
        <Title order={3}>{question.question}</Title>
      </Group>
      <Divider />
      <Stack gap="md">
        {question.description && (
          <Text size="sm">
            {question.description}
          </Text>
        )}
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type your answer here..."
          minRows={8}
          maxRows={8}
          radius="md"
          resize="vertical"
        />
      </Stack>
    </Stack>
  );
};
