"use client"
import { Button,  Stack, Title } from '@mantine/core'
import React from 'react'
import { JobFilter } from './_components/JobFilter'
import { JobLists } from './_components/JobLists'
import { useSearchParams } from 'next/navigation';
import { JobGrid } from './_components/JobGrid';
import { useCreateJob, useGetJobs } from '@agent-xenon/react-query-hooks'
import { IJob } from '@agent-xenon/interfaces'

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const page = searchParams.get('page') || 1
  const pageSize = searchParams.get('pageSize') || 10
  const search = searchParams.get('search') || ''
  const { data, isLoading } = useGetJobs({ page: Number(page), limit: Number(pageSize), search: search });

  const { mutate: createJob, isPending: isCreating } = useCreateJob();

  const handleCreateJob = () => {
    createJob(
      {
        rounds: [],
      },
      {
        onSuccess: (newJob: IJob) => {
          if (newJob?._id) {
            console.log(newJob);
          }
        },
      }
    );
  };

  return (
    <Stack gap='sm'>
      <Title order={4}>Jobs</Title>
      <Button mb='md' component='a' onClick={handleCreateJob} styles={{ root: { width: 'fit-content' } }}>Create +</Button>
      <JobFilter />
      {view === 'list' && <JobLists data={data?.data?.jobData || []} isFetching={isLoading} />}
      {view === 'grid' && <JobGrid data={data?.data?.jobData || []} isFetching={isLoading}/>}
    </Stack>
  )
}