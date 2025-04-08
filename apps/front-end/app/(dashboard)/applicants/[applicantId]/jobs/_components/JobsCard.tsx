import React from 'react';
import {
  Text,
  Badge,
  Card,
  Group,
  Title,
  Anchor,
} from '@mantine/core';
import { IJob } from '@agent-xenon/interfaces';
import { useParams } from 'next/navigation';
import { getJobStatusColor } from '@/libs/utils/ui-helpers';
import Link from 'next/link';

interface IJobCard {
  job: IJob;
}

export const JobsCard = ({ job }: IJobCard) => {
  const { applicantId } = useParams<{ applicantId: string }>();
  return (
    <Card key={job._id} shadow="sm" radius="md" withBorder mb="md">
      <Group mb="xs" justify='space-between'>
        <Anchor
          component={Link}
          href={`/applicants/${applicantId}/jobs/${job._id}`}
          underline="never"
        >
          <Title order={4} lineClamp={2} maw={250}>
            {job.title}
          </Title>
        </Anchor>
        <Badge color={getJobStatusColor(job.status)} variant="light">
          {job.status ?? "-"}
        </Badge>
      </Group>
      <Text size="sm" mb="xs">
        {job.description}
      </Text>
    </Card>
  );
}

