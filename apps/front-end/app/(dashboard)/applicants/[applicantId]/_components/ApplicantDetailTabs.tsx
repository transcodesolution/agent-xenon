'use client'
import React from 'react'
import { useState } from 'react';
import { FloatingIndicator, Tabs } from '@mantine/core';
import classes from '../applicantdetails.module.scss';
import { useRouter, usePathname } from 'next/navigation';

interface IApplicantDetailTabs {
  applicantId: string
}

export const ApplicantDetailTabs = ({ applicantId }: IApplicantDetailTabs) => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const router = useRouter();
  const pathName = usePathname();
  const value = pathName.split('/')[3] || 'details'
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {

    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const onTabChange = (tab: string | null) => {
    switch (tab) {
      case 'interviews':
        router.push(`/applicants/${applicantId}/interview`)
        break;
      case 'details':
        router.push(`/applicants/${applicantId}`)
        break;
    }
  }
  return (
    <Tabs variant="none" value={value} onChange={onTabChange}>
      <Tabs.List ref={setRootRef} className={classes.list}>
        <Tabs.Tab value="details" ref={setControlRef('details')} className={classes.tab}>
          Details
        </Tabs.Tab>
        <Tabs.Tab value="interviews" ref={setControlRef('interviews')} className={classes.tab}>
          Interview Rounds
        </Tabs.Tab>
        <FloatingIndicator
          target={value ? controlsRefs[value] : null}
          parent={rootRef}
          className={classes.indicator}
        />
      </Tabs.List>
    </Tabs>
  );
}
