'use client'
import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateTraining } from '@agent-xenon/react-query-hooks';
import { IApiResponse, ITraining } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { usePermissions } from '@/libs/hooks/usePermissions';
import { TrainingFilter } from './_components/TrainingFilter';
import { TrainingList } from './_components/TrainingList';


export default function Page() {
  const { mutate: createTraining, isPending: isCreating } = useCreateTraining();
  const router = useRouter()
  const permission = usePermissions()

  const handleCreateTraining = () => {
    createTraining(
      {},
      {
        onSuccess: (newTraining: IApiResponse<ITraining>) => {
          const trainingsId = newTraining?.data?._id
          if (trainingsId) {
            router.push(`/trainings/${trainingsId}`);
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

  // if (!permission?.hasTrainingRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4} >Trainings</Title>
      <Button component='a' disabled={isCreating} onClick={handleCreateTraining} w='fit-content' loading={isCreating}>Create +</Button>
      <TrainingFilter />
      <TrainingList />
    </Stack>
  )
}