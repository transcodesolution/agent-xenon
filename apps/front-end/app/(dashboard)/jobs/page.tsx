"use client"
import { Button, Stack, Title } from '@mantine/core'
import React from 'react'
import { JobFilter } from './_components/JobFilter'
import { JobLists } from './_components/JobLists'
import { useRouter, useSearchParams } from 'next/navigation';
import { JobGrid } from './_components/JobGrid';
import { useCreateJob, useDeleteJobs, useGetJobs } from '@agent-xenon/react-query-hooks'
import { IApiResponse, IJob } from '@agent-xenon/interfaces'
import { usePermissions } from '@/libs/hooks/usePermissions'

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const page = searchParams.get('page') || 1
  const pageSize = searchParams.get('pageSize') || 50
  const search = searchParams.get('search') || ''
  const { data: getJobResponse, isLoading, refetch } = useGetJobs({ page: Number(page), limit: Number(pageSize), search: search });
  const router = useRouter()
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { deleteJobsMutation } = useDeleteJobs();
  const permission = usePermissions()
  const jobs = getJobResponse?.data?.jobs ?? [];

  const onDelete = (jobIds: string[]) => {
    deleteJobsMutation.mutate(
      { jobIds },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleCreateJob = () => {
    createJob(
      {
        rounds: [],
      },
      {
        onSuccess: (newJob: IApiResponse<IJob>) => {
          const jobId = newJob?.data?._id
          if (jobId) {
            router.push(`/jobs/${jobId}`);
          }
        },
      }
    );
  };

  if (!permission?.hasJobRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4}>Jobs</Title>
      {permission?.hasJobCreate &&
        <Button component='a' disabled={isCreating} onClick={handleCreateJob} styles={{ root: { width: 'fit-content' } }} loading={isCreating}>Create +</Button>
      }
      <JobFilter />
      {view === 'list' && <JobLists data={jobs ?? []} isFetching={isLoading} onDelete={onDelete} />}
      {view === 'grid' && <JobGrid data={jobs ?? []} isFetching={isLoading} />}
    </Stack>
  )
}