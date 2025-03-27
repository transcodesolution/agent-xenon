import React from 'react';
import {
  Text,
  Button,
  Stack,
  Flex,
  Paper,
  Divider,
  Badge,
} from '@mantine/core';
import { IJob } from '@agent-xenon/interfaces';

interface IJobCard {
  job: IJob;
}

export const JobCard = ({ job }: IJobCard) => {
  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Text fz="md" fw={600}>
            {job.title ?? "-"}
          </Text>
          <Badge color="blue" variant="light">
            {job.status ?? "-"}
          </Badge>
        </Flex>
        <Divider />
        <Button variant="light" color="blue" fullWidth>
          Apply Now
        </Button>
      </Stack>
    </Paper>
  );
}

export default JobCard;
