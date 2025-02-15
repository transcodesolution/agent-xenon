"use client"
import { Button, Paper, Stack, Title } from '@mantine/core'
import React from 'react'
import { JobFilter } from './_components/JobFilter'
import { JobLists } from './_components/JobLists'
import { useSearchParams } from 'next/navigation';
import { JobGrid } from './_components/JobGrid';
import { JobStatus } from '@agent-xenon/constants'
import { IJob } from '@agent-xenon/interfaces'

const data: IJob[] = [
  {
    _id: '1',
    title: 'Senior Software Engineer',
    description: 'Responsible for developing and maintaining web applications.',
    role: 'Developer',
    status: JobStatus.OPEN,
    designation: 'Senior Engineer',
    qualificationCriteria: '5+ years of experience in software development',
    organizationId: 'Tech Corp',
    createdAt: new Date(),
    updatedAt: new Date(),
    rounds: [
      {
        _id: 'round1',
        type: 'Technical',
        durationInSeconds: 3600,
        qualificationCriteria: 'Pass technical test',
        roundNumber: 1,
      },
    ],
  },
  {
    _id: '2',
    title: 'Junior Software Engineer',
    description: 'Assist in the development and maintenance of web applications.',
    role: 'Developer',
    status: JobStatus.OPEN,
    designation: 'Junior Engineer',
    qualificationCriteria: '1+ years of experience in software development',
    organizationId: 'Innovate Ltd',
    createdAt: new Date(),
    updatedAt: new Date(),
    rounds: [
      {
        _id: 'round2',
        type: 'Technical',
        durationInSeconds: 1800,
        qualificationCriteria: 'Pass technical test',
        roundNumber: 1,
      },
    ],
  },
  {
    _id: '3',
    title: 'Senior Business Executive',
    description: 'Responsible for business development and client relations.',
    role: 'Business',
    status: JobStatus.OPEN,
    designation: 'Senior Executive',
    qualificationCriteria: '5+ years of experience in business development',
    organizationId: 'Design Studio',
    createdAt: new Date(),
    updatedAt: new Date(),
    rounds: [
      {
        _id: 'round3',
        type: 'HR',
        durationInSeconds: 3600,
        qualificationCriteria: 'Pass HR interview',
        roundNumber: 1,
      },
    ],
  }
];

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  return (
    <Stack gap='sm'>
      <Title order={4}>Jobs</Title>
      <Button mb='md' component='a' href='/jobs/create' styles={{ root: { width: 'fit-content' } }}>Create +</Button>
      <JobFilter />
      {view === 'list' ?
        <Paper withBorder radius="md" p="md">
          <JobLists data={data} />
        </Paper>
        : <JobGrid data={data} />
      }
    </Stack>
  )
}
