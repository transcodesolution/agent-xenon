import React from 'react';
import { Stack } from '@mantine/core';
import { JobList } from './_components/JobList';

export default function Page() {
  return (
    <Stack pos='relative'>
      <JobList />
    </Stack>
  )
}