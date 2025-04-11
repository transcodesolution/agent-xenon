'use client';
import { useGetApplicantAppliedJobsById } from '@/libs/react-query-hooks/src/lib/applicant/useGetApplicantAppliedJobsById';
import { Card, LoadingOverlay, SimpleGrid, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import { JobsCard } from './JobsCard';

export const JobList = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: getApplicantAppliedJobsByIdResponse, isFetching } = useGetApplicantAppliedJobsById({ applicantId: applicantId });
  const jobs = getApplicantAppliedJobsByIdResponse?.data || [];

  if (isFetching) {
    return <LoadingOverlay visible />
  }

  if (jobs.length > 0) {
    return (
      <Card withBorder radius="md" p="xl" shadow="sm">
        <Text ta="center" fs="italic" c="dimmed">
          No jobs found for this applicant.
        </Text>
      </Card>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      {jobs.map((job) => <JobsCard key={job._id} job={job} />)}
    </SimpleGrid>
  );
};
