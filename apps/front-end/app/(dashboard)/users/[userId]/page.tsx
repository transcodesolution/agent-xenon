import React from 'react'
import { UserDetail } from './_components/UserDetails'
import BackToOverview from '@/libs/components/custom/back-to-overview';

export default async function page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return (
    <React.Fragment>
      <BackToOverview title="Back" backUrl='/users' />
      <UserDetail userId={userId} />
    </React.Fragment>
  )
}