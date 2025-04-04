'use client'
import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateJobRole } from '@agent-xenon/react-query-hooks';
import { IApiResponse, IJobRole } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { usePermissions } from '@/libs/hooks/usePermissions';
import { JobRoleList } from './_components/JobRoleList';
import { JobRoleFilter } from './_components/JobRoleFilter';

export default function Page() {
  const { mutate: createJobRole, isPending: isCreating } = useCreateJobRole();
  const router = useRouter()
  const permission = usePermissions()

  const handleCreateJobRole = () => {
    createJobRole(
      {},
      {
        onSuccess: (newJob: IApiResponse<IJobRole>) => {
          const roleId = newJob?.data?._id
          if (roleId) {
            router.push(`/job-roles/${roleId}`);
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

  if (!permission?.hasJobRoleRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4} >Job Roles</Title>
      <Button component='a' disabled={isCreating} onClick={handleCreateJobRole} w='fit-content' loading={isCreating}>Create +</Button>
      <JobRoleFilter />
      <JobRoleList />
    </Stack>
  )
}