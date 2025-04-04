'use client'
import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateDesignation } from '@agent-xenon/react-query-hooks';
import { IApiResponse, IDesignation } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { usePermissions } from '@/libs/hooks/usePermissions';
import { DesignationFilter } from './_components/DesignationFilter';
import { DesignationList } from './_components/DesignationList';

export default function Page() {
  const { mutate: createDesignation, isPending: isCreating } = useCreateDesignation();
  const router = useRouter()
  const permission = usePermissions()

  const handleCreateDesignation = () => {
    createDesignation(
      {},
      {
        onSuccess: (newDesignation: IApiResponse<IDesignation>) => {
          const designationId = newDesignation?.data?._id
          if (designationId) {
            router.push(`/designation/${designationId}`);
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

  if (!permission?.hasDesignationRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4} >Designation</Title>
      <Button component='a' disabled={isCreating} onClick={handleCreateDesignation} w='fit-content' loading={isCreating}>Create +</Button>
      <DesignationFilter />
      <DesignationList />
    </Stack>
  )
}