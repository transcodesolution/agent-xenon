'use client'
import React from 'react';
import { QuestionFilter } from './_components/QuestionFilter';
import { QuestionList } from './_components/QuestionList';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateQuestion } from '@agent-xenon/react-query-hooks';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { IApiResponse, IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { usePermissions } from '@/libs/hooks/usePermissions';

export default function Page() {
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const router = useRouter()
  const permissions = usePermissions()

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

  if (!permissions?.hasQuestionAnswerRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4} >Questions</Title>
      {permissions?.hasQuestionAnswerCreate &&
        <Button component='a' disabled={isCreating} onClick={handleCreateQuestion} w='fit-content' loading={isCreating}>Create +</Button>
      }
      <QuestionFilter />
      <QuestionList />
    </Stack>
  )
}