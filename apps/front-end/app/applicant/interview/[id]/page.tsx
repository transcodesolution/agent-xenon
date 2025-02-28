'use client'

import { Question } from "@/libs/components/custom/question";
import { useGetInterviewMCQQuestions } from "@/libs/react-query-hooks/src/lib/interview/useGetInterviewMCQQuestions";
import { AnswerMcqOptionFormat } from "@agent-xenon/constants";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Button, Flex, Stack } from "@mantine/core";
import { useState, useEffect } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState<IInterviewQuestionAnswer | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerMcqOptionFormat[]>>({});

  const { data, isLoading } = useGetInterviewMCQQuestions({ roundId: id });
  const questions = data?.data

  useEffect(() => {
    if (questions && questions?.length > 0) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions]);

  const handleNextQuestion = () => {
    if (!questions || !currentQuestion) return;
    const currentIndex = questions.indexOf(currentQuestion);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestion(questions[currentIndex + 1]);
    }
  };

  const handlePreviousQuestion = () => {
    if (!questions || !currentQuestion) return;
    const currentIndex = questions.indexOf(currentQuestion);
    if (currentIndex > 0) {
      setCurrentQuestion(questions[currentIndex - 1]);
    }
  };

  const isPreviousButtonDisabled = !questions || !currentQuestion || questions.indexOf(currentQuestion) === 0;
  const isNextButtonDisabled = !questions || !currentQuestion || questions.indexOf(currentQuestion) === questions.length - 1;

  const handleAnswer = (questionId: string, answer: AnswerMcqOptionFormat[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  if (isLoading) { return 'Loading...' }

  return (
    <Stack>
      {currentQuestion && (
        <Question
          question={currentQuestion}
          onAnswer={handleAnswer}
          answers={answers[currentQuestion._id] || []}
        />
      )}
      <Flex justify="space-between" align="center">
        <Button onClick={handlePreviousQuestion} disabled={isPreviousButtonDisabled}>
          Previous
        </Button>
        <Button onClick={handleNextQuestion} disabled={isNextButtonDisabled}>
          Next
        </Button>
      </Flex>
    </Stack>
  );
}