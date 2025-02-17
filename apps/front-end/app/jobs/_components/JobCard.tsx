import React from 'react';
import {
  Text,
  Badge,
  Button,
  Stack,
  Flex,
  Paper,
  PaperProps,
  Divider,
} from '@mantine/core';
import { IJob } from '@agent-xenon/interfaces';

interface JobCardProps extends PaperProps {
  job: IJob;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Paper shadow="sm" p="lg" radius="md" >
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Text fz="md" fw={600}>
            {job.title}
          </Text>
          <Badge color="blue" variant="light">
            {job.designation}
          </Badge>
        </Flex>

        <Text fz="sm" style={{ lineHeight: 1.5 }}>
          {job.organizationId}
        </Text>

        <Divider />

        <Button variant="light" color="blue" fullWidth>
          Apply Now
        </Button>
      </Stack>
    </Paper>
  );
};

export default JobCard;