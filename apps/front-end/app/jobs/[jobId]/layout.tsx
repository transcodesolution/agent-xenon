import React from 'react'
import { JobDetailTabs } from './_components/JobDetailTabs';

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
      <JobDetailTabs jobId={jobId} />
      {children}
    </section>
  );
}
