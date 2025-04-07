'use client';
import { useGetApplicantAppliedJobsById } from '@/libs/react-query-hooks/src/lib/applicant/useGetApplicantAppliedJobsById';
import { LoadingOverlay, SimpleGrid, Skeleton } from '@mantine/core';
import { useParams } from 'next/navigation';
import { JobsCard } from './JobsCard';

export const JobList = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: jobs, isFetching } = useGetApplicantAppliedJobsById({ applicantId: applicantId });

  if (isFetching) {
    return <LoadingOverlay visible />
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      {isFetching
        ? Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} visible={true} height={300} />
        ))
        : jobs?.data?.map((job) => <JobsCard key={job._id} job={job} />)}
    </SimpleGrid>
  );
};
