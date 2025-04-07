import { Loader, SimpleGrid } from '@mantine/core';
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
      {data?.map((job) => <JobCard key={job._id} job={job} />)}
    </SimpleGrid>
  );
}
