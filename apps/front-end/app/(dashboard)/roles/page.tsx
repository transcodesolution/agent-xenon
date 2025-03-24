'use client'
import React from 'react';
import { RoleFilter } from './_components/RoleFilter';
import { RoleList } from './_components/RoleList';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateRole } from '@agent-xenon/react-query-hooks';
import { IApiResponse, IRole } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export default function Page() {
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const router = useRouter()

  const handleCreateRole = () => {
    createRole(
      {
        permissions: [],
      },
      {
        onSuccess: (newJob: IApiResponse<IRole>) => {
          const roleId = newJob?.data?._id
          if (roleId) {
            router.push(`/roles/${roleId}`);
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
    <Stack gap='sm'>
      <Title order={4} >Roles</Title>
      <Button component='a' disabled={isCreating} onClick={handleCreateRole} w='fit-content' loading={isCreating}>Create +</Button>
      <RoleFilter />
      <RoleList />
    </Stack>
  )
}