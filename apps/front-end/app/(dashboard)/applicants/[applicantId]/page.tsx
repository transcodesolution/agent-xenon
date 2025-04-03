import React from 'react';
import { Stack } from '@mantine/core';
import { ApplicantDetails } from './_components/ApplicantDetails';

export default function Page() {
  return (
    <Stack pos='relative'>
      <ApplicantDetails />
    </Stack>
  )
}