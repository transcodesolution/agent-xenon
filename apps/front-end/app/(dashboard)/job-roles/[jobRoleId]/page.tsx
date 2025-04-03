import React from 'react';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';
import { JobRoleDetails } from './_components/JobRoleDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/job-roles' />
      <JobRoleDetails />
    </Stack>
  )
}