import React from 'react';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';
import { TrainingDetails } from './_components/TrainingDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/trainings' />
      <TrainingDetails />
    </Stack>
  )
}