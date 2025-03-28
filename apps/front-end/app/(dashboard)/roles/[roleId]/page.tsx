'use client'
import React from 'react';
import { RoleDetails } from './_components/RoleDetails';
import BackToOverview from '@/libs/components/custom/back-to-overview';
import { Stack } from '@mantine/core';

export default function Page() {
  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/roles' />
      <RoleDetails />
    </Stack>
  )
}