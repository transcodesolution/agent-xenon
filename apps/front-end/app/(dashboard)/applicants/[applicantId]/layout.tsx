import React from 'react'
import { ApplicantDetailTabs } from './_components/ApplicantDetailTabs';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ applicantId: string }>
}) {
  const applicantId = (await params).applicantId
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/applicants' />
      <ApplicantDetailTabs applicantId={applicantId} />
      {children}
    </Stack>
  );
}