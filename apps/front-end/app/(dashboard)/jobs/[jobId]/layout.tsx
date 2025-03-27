import React from 'react'
import { JobDetailTabs } from './_components/JobDetailTabs';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ jobId: string }>
}) {
  const jobId = (await params).jobId
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/jobs' />
      <JobDetailTabs jobId={jobId} />
      {children}
    </Stack>
  );
}