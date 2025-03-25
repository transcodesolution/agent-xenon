'use client'
import { Title, Button, Stack } from '@mantine/core'
import React from 'react'
import { UserFilter } from './_components/UserFilter'
import { UserList } from './_components/UserList'
import { IApiResponse } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useCreateUser } from '@/libs/react-query-hooks/src';
import { useRouter } from 'next/navigation'
import { IUpdateUserResponse } from '@/libs/types-api/src'

export default function Page() {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const router = useRouter()

  const handleCreateUser = () => {
    createUser(
      {
      },
      {
        onSuccess: (newUser: IApiResponse<IUpdateUserResponse>) => {
          const userId = newUser?.data?.user?._id
          if (userId) {
            router.push(`/users/${userId}`);
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
      <Title order={4} mb='md'>Users</Title>
      <Button mb='md' component='a' disabled={isCreating} onClick={handleCreateUser} w='fit-content' loading={isCreating}>Create +</Button>
      <UserFilter />
      <UserList />
    </Stack>
  )
}