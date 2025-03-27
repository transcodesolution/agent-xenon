'use client'

import { Question } from "@/libs/components/custom/question";
import { useGetInterviewQuestions, useSubmitInterviewQuestions } from "@agent-xenon/react-query-hooks";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Button, Container, Divider, Flex, Group, Stack, Title } from "@mantine/core";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { ExamSubmissionStatus } from "../../_components/ExamSubmissionStatus";
import { ExamStatusAlert } from "../../_components/ExamStatusAlert";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const [currentQuestion, setCurrentQuestion] = useState<IInterviewQuestionAnswer | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, isLoading, refetch } = useGetInterviewQuestions({ roundId: id });
  const { mutate: submitInterviewQuestions, } = useSubmitInterviewQuestions();

  const questions = data?.data?.questions || []
  const examStatus = data?.data?.status;
  const currentIndex = questions?.findIndex(q => q._id === currentQuestion?._id);
  const isLastQuestion = currentIndex === questions?.length - 1;

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
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Array.isArray(answer) ? answer.join(",") : answer,
    }));
  };

  const handleSubmit = () => {
    const formattedAnswers = questions.map((question) => {
      const answer = answers[question._id] || "";
      return {
        questionId: question._id,
        answer: answer
      };
    });

    submitInterviewQuestions(
      { roundId: id, questionAnswers: formattedAnswers },
      {
        onSuccess: (response) => {
          if (response?.data?.status) {
            refetch();
            setIsSubmitted(false)
          } else {
            setIsSubmitted(true)
          }
        },
        onError: (error) => {
          showNotification({ message: error.message, color: 'red' });
        }
      }
    );
  };

  if (isLoading) { return 'Loading...' }

  return (
    <Container size="xl">
      {
        examStatus &&
        <ExamStatusAlert status={examStatus} />
      }
      {isSubmitted &&
        <ExamSubmissionStatus
          totalQuestions={questions.length}
          answeredQuestions={Object.keys(answers).length}
          roundName={data?.data?.roundName ?? "Technical Interview"}
        />
      }
      {
        (questions?.length > 0 && !isSubmitted) &&
        <Stack>
          <Stack h="calc(100vh - 150px)">
            <Group justify="space-between" align="center" >
              <Title order={3}>{currentIndex + 1}. {currentQuestion?.question}</Title>
            </Group>
            <Divider />
            {currentQuestion && (
              <Question
                question={currentQuestion}
                onAnswer={handleAnswer}
                answers={answers[currentQuestion._id] || ""}
              />
            )}
          </Stack>
          <Flex gap='lg' justify='center' align="center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                variant="outline"
              >
                Next
              </Button>
            )}
          </Flex>
        </Stack>
      }
    </Container >
  )
}