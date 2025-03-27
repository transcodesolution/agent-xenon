import React from 'react'
import { JobDetailTabs } from './_components/JobDetailTabs';
import BackToOverview from '@/libs/components/custom/back-to-overview';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ jobId: string }>
}) {
  const jobId = (await params).jobId
  return (
    <section>
      <BackToOverview title="Back" backUrl='/jobs' />
      <JobDetailTabs jobId={jobId} />
      {children}
    </section>
  );
}