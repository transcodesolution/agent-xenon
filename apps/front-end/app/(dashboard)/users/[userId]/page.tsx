"use client";
import React from 'react'
import { useGetUserById, useUpdateUser } from '@/libs/react-query-hooks/src';
import { UserForm } from '../_components/UserForm';
import { IUser } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useParams } from 'next/navigation';

export default function page() {
  const { userId } = useParams<{ userId: string }>();
  const { data } = useGetUserById({ id: userId });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const user = data?.data?.user;
  const handleCreateUser = (user: Partial<IUser>) => {
    updateUser(
      { _id: userId, ...user },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Updated Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
            color: "red",
            icon: <IconCheck size={16} />,
          });
        },
      }
    );
  };
  return (
    <UserForm onSubmit={handleCreateUser} isLoading={isUpdating} user={user} />
  )
}