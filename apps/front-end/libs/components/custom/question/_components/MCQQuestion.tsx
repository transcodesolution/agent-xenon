import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Checkbox, Flex, Stack, Text } from "@mantine/core";
import { useState } from "react";

interface IMCQQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const MCQQuestion = ({ question, answer, onAnswer }: IMCQQuestion) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    answer ? answer.split("_") : []
  );

  const handleAnswerSelect = (optionIndex: string) => {
    let newAnswers: string[];

    if (question.isMultiSelectOption) {
      if (selectedAnswers.includes(optionIndex)) {
        newAnswers = selectedAnswers.filter(a => a !== optionIndex);
      } else {
        newAnswers = [...selectedAnswers, optionIndex];
      }
    } else {
      newAnswers = [optionIndex];
    }

    const answerString = newAnswers.join('_');
    setSelectedAnswers(newAnswers);
    onAnswer(question._id, answerString);
  };

  return (
    <Stack gap="md">
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

      {question.isMultiSelectOption && (
        <Text size="sm" c="dimmed">
          This question contains multiple right answers.
        </Text>
      )}
    </Stack>
  );
};