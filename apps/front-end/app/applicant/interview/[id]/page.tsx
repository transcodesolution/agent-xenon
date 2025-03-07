'use client'

import { Question } from "@/libs/components/custom/question";
import { useGetInterviewMCQQuestions, useSubmitExamMCQQuestions } from "@agent-xenon/react-query-hooks";
import { AnswerMcqOptionFormat } from "@agent-xenon/constants";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Button, Card, Container, Flex, Group, Progress, Stack, Text, Title } from "@mantine/core";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { ExamSubmissionStatus } from "../../_components/ExamSubmissionStatus";
import { ExamStatusAlert } from "../../_components/ExamStatusAlert";

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState<IInterviewQuestionAnswer | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerMcqOptionFormat[]>>({});
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useGetInterviewMCQQuestions({ roundId: id });
  const { mutate: submitExamMCQQuestions, } = useSubmitExamMCQQuestions();
  const [isSubmitted, setIsSubmitted] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = data?.data?.questions || []
  const examStatus = data?.data?.status;

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

  const handleAnswer = (questionId: string, answer: AnswerMcqOptionFormat[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  if (isLoading) { return 'Loading...' }
  const currentIndex = questions?.findIndex(q => q._id === currentQuestion?._id);
  const isLastQuestion = currentIndex === questions?.length - 1;
  const progressPercentage = ((currentIndex + 1) / questions?.length) * 100;

  const handleSubmit = () => {
    const formattedAnswers = questions.map((question) => {
      const answer = answers[question._id] || [];
      return {
        questionId: question._id || "",
        answerDetails: {
          text: answer.length > 0 ? answer[0] : ""
        }
      };
    });

    submitExamMCQQuestions(
      { roundId: id, questionAnswers: formattedAnswers },
      {
        onSuccess: (response) => {
          if (response?.data?.status) {
            refetch()
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
          <Stack align="center" mb='xl' gap='xs'>
            <Title order={1} >{data?.data?.roundName ?? "Technical Interview"} </Title>
            <Text c='gray'>Select the best answer for each question. You can navigate between questions using the buttons below.</Text>
          </Stack >
          <Stack mt='xl'>
            <Card padding="xl" radius="md" withBorder>
              <Stack>
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">
                    Question {currentIndex + 1} of {questions?.length}
                  </Text>
                  <Progress
                    value={progressPercentage}
                    size="sm"
                    w={120}
                  />
                </Group>
                {currentQuestion && (
                  <Question
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    answers={answers[currentQuestion._id] || []}

                  />
                )}
              </Stack>
            </Card>
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
        </Stack>
      }
    </Container >
  )

}