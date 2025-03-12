'use client'
import { Title, Button } from '@mantine/core'
import React from 'react'
import { UserFilter } from './_components/UserFilter'
import { UserList } from './_components/UserList'
import { IApiResponse, IUser } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useCreateUser } from '@/libs/react-query-hooks/src';
import { useRouter } from 'next/navigation'

export default function Page() {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const router = useRouter()

  const handleCreateUser = () => {
    createUser(
      {
      },
      {
        onSuccess: (newJob: IApiResponse<IUser>) => {
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
    <React.Fragment>
      <Title order={4} mb='md'>Users</Title>
      <Button mb='md' component='a' disabled={isCreating} onClick={handleCreateUser} w='fit-content' loading={isCreating}>Create +</Button>
      <UserFilter />
      <UserList />
    </React.Fragment>
  )
}