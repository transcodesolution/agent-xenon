'use client'
import React from 'react';
import { QuestionFilter } from './_components/QuestionFilter';
import { QuestionList } from './_components/QuestionList';
import { Button, Title } from '@mantine/core';
import { useCreateQuestion } from '@agent-xenon/react-query-hooks';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';

export default function Page() {
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const router = useRouter()

  const handleCreateQuestion = () => {
    createQuestion({},
      {
        onSuccess: (newJob: IApiResponse<IInterviewQuestionAnswer>) => {
          const QuestionId = newJob?.data?._id
          if (QuestionId) {
            router.push(`/questions/${QuestionId}`);
          }
        },
        onError: (error) => {
          showNotification({
            title: "Create Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };

  return (
    <React.Fragment>
      <Title order={4} mb='md'>Questions</Title>
      <Button mb='md' component='a' disabled={isCreating} onClick={handleCreateQuestion} w='fit-content' loading={isCreating}>Create +</Button>
      <QuestionFilter />
      <QuestionList />
    </React.Fragment>
  )
}