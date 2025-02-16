"use client"
import { Button,  Stack, Title } from '@mantine/core'
import React from 'react'
import { JobFilter } from './_components/JobFilter'
import { JobLists } from './_components/JobLists'
import { useSearchParams } from 'next/navigation';
import { JobGrid } from './_components/JobGrid';
import { useGetJobs } from '@agent-xenon/react-query-hooks'

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const { data, isLoading } = useGetJobs({ page: 1, limit: 10 });

  return (
    <Stack gap='sm'>
      <Title order={4}>Jobs</Title>
      <Button mb='md' component='a' href='/jobs/create' styles={{ root: { width: 'fit-content' } }}>Create +</Button>
      <JobFilter />
      {view === 'list' && <JobLists data={data?.data?.jobData || []} isFetching={isLoading} />}
      {view === 'grid' && <JobGrid data={data?.data?.jobData || []} isFetching={isLoading}/>}
    </Stack>
  )
}