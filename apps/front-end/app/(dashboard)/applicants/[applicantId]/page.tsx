'use client'
import React from 'react';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';
import { ApplicantDetails } from './_components/ApplicantDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/applicants' />
      <ApplicantDetails />
    </Stack>
  )
}