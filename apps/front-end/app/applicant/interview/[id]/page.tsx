'use client'

import { Question } from "@/libs/components/custom/question";
import { useGetInterviewMCQQuestions, useSubmitExamMCQQuestions } from "@agent-xenon/react-query-hooks";
import { AnswerMcqOptionFormat, ExamStatus } from "@agent-xenon/constants";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { Button, Container, Flex, Stack, Text, Title } from "@mantine/core";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { ExamCompletionStatus } from "../../_components/ExamCompletionStatus";

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState<IInterviewQuestionAnswer | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerMcqOptionFormat[]>>({});
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetInterviewMCQQuestions({ roundId: id });
  const { mutate: submitExamMCQQuestions, } = useSubmitExamMCQQuestions();
  const [examProgress, setExamProgress] = useState<ExamStatus | "success" | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = data?.data?.questions || []
  const examStatus = data?.data?.status;

  useEffect(() => {
    if (examStatus === ExamStatus.LINK_EXPIRED) {
      showNotification({ message: 'This exam link has expired.', color: 'orange', title: 'Link Expired' });
      setExamProgress(ExamStatus.LINK_EXPIRED);
    } else if (examStatus === ExamStatus.EXAM_COMPLETED) {
      showNotification({ message: 'You have already completed this exam.', color: 'blue', title: 'Exam Completed' });
      setExamProgress(ExamStatus.EXAM_COMPLETED);
    }
  }, [data]);

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
          showNotification({ message: response.message, color: 'green', title: 'Success' });
          if (response?.data?.status) {
            setExamProgress(response?.data?.status);
          } else {

            setExamProgress("success");
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
        (examProgress !== null) &&
        <ExamCompletionStatus
          totalQuestions={questions.length}
          answeredQuestions={Object.keys(answers).length}
          status={examProgress}
          roundName={data?.data?.roundName ?? "Technical Interview"}
        />
      }
      {
        (questions?.length > 0) &&
        <Stack>
          <Stack align="center" mb='xl' gap='xs'>
            <Title order={1} >{data?.data?.roundName ?? "Technical Interview"} </Title>
            <Text c='gray' >Select the best answer for each question. You can navigate between questions using the buttons below.</Text>
          </Stack >
          <Stack mt='xl'>
            {currentQuestion && (
              <Question
                question={currentQuestion}
                onAnswer={handleAnswer}
                answers={answers[currentQuestion._id] || []}
                currentQuestionIndex={currentIndex}
                totalQuestions={questions?.length}
              />
            )}
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