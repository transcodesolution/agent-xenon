import React from 'react'
import { UserDetail } from './_components/UserDetails'

export default async function page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return (
    <UserDetail userId={userId} />
  )
}