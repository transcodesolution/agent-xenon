'use client'
import React from 'react'
import { useState } from 'react';
import { FloatingIndicator, Tabs } from '@mantine/core';
import classes from '../jobdetails.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { usePermissions } from '@/libs/hooks/usePermissions';

interface IJobDetailTabs {
  jobId: string
}

export const JobDetailTabs = ({ jobId }: IJobDetailTabs) => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const router = useRouter();
  const pathName = usePathname();
  const permission = usePermissions()
  const value = pathName.split('/')[3] || 'details'
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {

    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const onTabChange = (tab: string | null) => {
    switch (tab) {
      case 'applicants':
        router.push(`/jobs/${jobId}/applicants`)
        break;
      case 'rounds':
        router.push(`/jobs/${jobId}/rounds`)
        break;
      case 'details':
        router.push(`/jobs/${jobId}`)
        break;
    }
  }
  return (
    <Tabs variant="none" value={value} onChange={onTabChange}>
      <Tabs.List ref={setRootRef} className={classes.list}>
        <Tabs.Tab value="details" ref={setControlRef('details')} className={classes.tab}>
          Details
        </Tabs.Tab>
        {permission?.hasJobApplicantsTab &&
          <Tabs.Tab value="applicants" ref={setControlRef('applicants')} className={classes.tab}>
            Applicants
          </Tabs.Tab>
        }
        {permission?.hasJobRoundsTab &&
          <Tabs.Tab value="rounds" ref={setControlRef('rounds')} className={classes.tab}>
            Rounds
          </Tabs.Tab>
        }

        <FloatingIndicator
          target={value ? controlsRefs[value] : null}
          parent={rootRef}
          className={classes.indicator}
        />
      </Tabs.List>
    </Tabs>
  );
}
