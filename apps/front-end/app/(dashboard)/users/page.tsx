'use client'
import { Title, Button, Stack } from '@mantine/core'
import React from 'react'
import { UserFilter } from './_components/UserFilter'
import { UserList } from './_components/UserList'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleCreateUser = () => {
    router.push(`/users/create`)
  };

  return (
    <Stack gap='sm'>
      <Title order={4} mb='md'>Users</Title>
      <Button mb='md' component='a' onClick={handleCreateUser} w='fit-content' >Create +</Button>
      <UserFilter />
      <UserList />
    </Stack >
  )
}