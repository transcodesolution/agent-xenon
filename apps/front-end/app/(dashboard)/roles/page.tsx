'use client'
import React from 'react';
import { RoleFilter } from './_components/RoleFilter';
import { RoleList } from './_components/RoleList';
import { Button, Title } from '@mantine/core';
import { useCreateRole } from '@agent-xenon/react-query-hooks';
import { IApiResponse, IRole } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';

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
      }
    );
  };

  return (
    <React.Fragment>
      <Title order={4} mb='md'>Roles</Title>
      <Button mb='md' component='a' disabled={isCreating} onClick={handleCreateRole} w='fit-content' loading={isCreating}>Create +</Button>
      <RoleFilter />
      <RoleList />
    </React.Fragment>
  )
}