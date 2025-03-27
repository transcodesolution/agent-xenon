import { Loader, SimpleGrid, Skeleton } from '@mantine/core';
import React from 'react';
import JobCard from './JobCard';
import { IJob } from '@agent-xenon/interfaces';

interface IJobGrid {
  data: IJob[];
  isFetching: boolean;
}

export const JobGrid = ({ data, isFetching }: IJobGrid) => {
  if (isFetching) {
    return <Loader />;
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      {isFetching
        ? Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={`project-loading-${i}`} visible={true} height={300} />
        ))
        : data?.map((job) => <JobCard key={job._id} job={job} />)}
    </SimpleGrid>
  );
}
