import React from 'react';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';
import { DesignationDetails } from './_components/DesignationDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/designation' />
      <DesignationDetails />
    </Stack>
  )
}