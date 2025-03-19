import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Stack, Text, Textarea } from "@mantine/core";
import { useState } from "react";

interface ITextQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const TextQuestion = ({ question, answer, onAnswer }: ITextQuestion) => {
  const [text, setText] = useState(answer || "");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.currentTarget.value;
    setText(newText);
    onAnswer(question._id, newText);
  };

  return (
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
  );
};
