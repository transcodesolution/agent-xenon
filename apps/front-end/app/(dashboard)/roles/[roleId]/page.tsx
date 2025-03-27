'use client'
import React from 'react';
import { RoleDetails } from './_components/RoleDetails';
import BackToOverview from '@/libs/components/custom/back-to-overview';

export default function Page() {
  return (
    <React.Fragment>
      <BackToOverview title="Back" backUrl='/roles' />
      <RoleDetails />
    </React.Fragment>
  )
}