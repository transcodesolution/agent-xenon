'use client'
import { AnswerMcqOptionFormat } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { Checkbox, Divider, Flex, Group, Progress, Stack, Text, Title } from '@mantine/core';
import { IconLayoutGrid } from '@tabler/icons-react';

interface IQuestion {
  question: IInterviewQuestionAnswer;
  answers: AnswerMcqOptionFormat[];
  onAnswer: (questionId: string, answer: AnswerMcqOptionFormat[]) => void;
}

export const Question = ({ question, onAnswer, answers }: IQuestion) => {

  const handleAnswerSelect = (answer: AnswerMcqOptionFormat) => {
    const newAnswer = [answer];
    onAnswer(question._id, newAnswer);
  }

  return (
    <Stack>
      <Group align='center' gap='md'>
        <IconLayoutGrid className="w-5 h-5" />
        <Title order={3}>{question.question}</Title>
      </Group>
      <Divider />
      <Stack gap="md">
        {question?.options?.map((option, index) => (
          <Stack key={index} gap="sm">
            <Flex align="center" gap="sm">
              <Checkbox
                checked={answers.includes(option.index)}
                onChange={(event) => handleAnswerSelect(option.index)}
                size="md"
                radius="sm"
                className="border-2"
              />
              <Text size="md">{option.text}</Text>
            </Flex>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};