import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Checkbox, Divider, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { IconLayoutGrid } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface IMCQQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const MCQQuestion = ({ question, answer, onAnswer }: IMCQQuestion) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (answer) {
      setSelectedAnswers(answer.split('_'));
    } else {
      setSelectedAnswers([]);
    }
  }, [answer]);

  const handleAnswerSelect = (optionIndex: string) => {
    let newAnswers: string[];

    if (selectedAnswers.includes(optionIndex)) {
      newAnswers = selectedAnswers.filter(a => a !== optionIndex);
    } else {
      newAnswers = [...selectedAnswers, optionIndex];
    }
    const answerString = newAnswers.join('_');
    setSelectedAnswers(newAnswers);
    onAnswer(question._id, answerString);
  };

  return (
    <Stack>
      <Group align="center" gap="md">
        <IconLayoutGrid />
        <Title order={3}>{question.question}</Title>
      </Group>
      <Divider />
      <Stack gap="md">
        {question.description && (
          <Text size="sm" c="dimmed">{question.description}</Text>
        )}
        {question?.options?.map((option) => (
          <Stack key={option.index} gap="sm">
            <Flex align="center" gap="sm">
              <Checkbox
                checked={selectedAnswers.includes(option.index)}
                onChange={() => handleAnswerSelect(option.index)}
                size="md"
                radius="sm"
              />
              <Text size="md">{option.text}</Text>
            </Flex>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};