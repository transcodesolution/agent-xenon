'use client'
import { AnswerMcqOptionFormat } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces'
import { Checkbox, Divider, Flex, Stack, Title } from '@mantine/core'
import React from 'react'

interface IQuestion {
  question: IInterviewQuestionAnswer;
  answers: AnswerMcqOptionFormat[];
  onAnswer: (questionId: string, answer: AnswerMcqOptionFormat[]) => void;
}

export const Question = ({ question, onAnswer, answers }: IQuestion) => {
  const handleAnswerSelect = (checked: boolean, answer: AnswerMcqOptionFormat) => {
    let newAnswer: AnswerMcqOptionFormat[];

    if (checked) {
      if (!answers.includes(answer)) {
        newAnswer = [...answers, answer];
      } else {
        newAnswer = answers;
      }
    } else {
      newAnswer = answers.filter((ans) => ans !== answer);
    }

    onAnswer(question._id, newAnswer);
  };

  return (
    <Stack>
      <Title order={3}>{question.question}</Title>
      <Divider />
      {question.options.map((option, index) => (
        <Stack key={index} gap='sm'>
          <Flex align='center' gap='sm'>
            <Checkbox id='1' checked={answers.includes(option.index)} onChange={(event) => handleAnswerSelect(event.target.checked, option.index)} />
            {option.text}
          </Flex>
          <Divider />
        </Stack>
      ))}
    </Stack>
  )
}