"use client";
import React from 'react'
import { useGetUserById, useUpdateUser } from '@/libs/react-query-hooks/src';
import { UserForm } from '../_components/UserForm';
import { IUser } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { LoadingOverlay, Stack } from '@mantine/core';

export default function page() {
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading } = useGetUserById({ id: userId });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const user = data?.data?.user;

  const handleUpdateUser = (user: Partial<IUser>) => {
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
    <Stack gap="lg" pos='relative'>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <BackToOverview title="Back" backUrl='/users' />
      <UserForm onSubmit={handleUpdateUser} isLoading={isUpdating} user={user} />
    </Stack>
  )
}