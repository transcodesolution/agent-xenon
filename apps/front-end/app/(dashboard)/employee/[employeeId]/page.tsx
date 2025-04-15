import React from 'react';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';
import { EmployeeDetails } from './_components/EmployeeDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/employee' />
      <EmployeeDetails />
    </Stack>
  )
}