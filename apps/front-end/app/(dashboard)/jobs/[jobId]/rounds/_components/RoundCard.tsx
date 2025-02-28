import { IInterviewRounds } from '@agent-xenon/interfaces';
import { ActionIcon, Badge, Card, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconClock, IconPlayerPlay, IconPlayerStop, IconUsers } from '@tabler/icons-react';
import React, { useState } from 'react'

const getRoundTypeColor = (type: string) => {
  switch (type) {
    case 'screening':
      return 'blue';
    case 'technical':
      return 'green';
    case 'meeting':
      return 'purple';
    default:
      return 'gray';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'yellow';
    case 'completed':
      return 'teal';
    default:
      return 'gray';
  }
};

const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  return `${days} days`;
};

interface IRoundCardProps {
  round: IInterviewRounds;
  isDisabled?: boolean;
  onStartRound?: (roundId: string) => void;
  onShowCandidates: (roundId: string) => void;
}

function RoundCard({ round, isDisabled, onStartRound, onShowCandidates }: IRoundCardProps) {
  const isOngoing = round.status === 'ongoing';
  const isCompleted = round.status === 'completed';

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
    >
      <Card.Section inheritPadding py="xs">

        <Group justify="space-between" wrap="nowrap">
          <Stack>
            <Text fw='600' size='xl'> {round.name || "-"}</Text>
          </Stack>

          <Group gap="xs">
            <Tooltip label={`Duration: ${formatDuration(round.durationInSeconds)}`}>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{formatDuration(round.durationInSeconds)}</Text>
              </Group>
            </Tooltip>

            <Tooltip label="View Candidates">
              <ActionIcon
                variant="subtle"
                onClick={(e) => {
                  onShowCandidates(round._id);
                }}
              >
                <IconUsers size={18} />
              </ActionIcon>
            </Tooltip>

          </Group>
        </Group>
      </Card.Section>

      <Text size="sm" c="dimmed" lineClamp={2}>
        {round.qualificationCriteria || "-"}
      </Text>

      <Flex justify='space-between' gap="md" mt="md">
        <Group>
          <Badge
            color={getRoundTypeColor(round.type)}
            size="lg"
            variant="light"
          >
            {round.type.charAt(0).toUpperCase() + round.type.slice(1)}
          </Badge>
          <Badge
            color={getStatusColor(round.status)}
            size="lg"
            variant="dot"
          >
            {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
          </Badge>
        </Group>
        {!isCompleted && (
          <Tooltip label={isOngoing ? "Stop Round" : "Start Round"}>
            <ActionIcon
              size='xl'
              variant="light"
              color={isOngoing ? "red" : "green"}
              disabled={isDisabled}
              onClick={() => { onStartRound?.(round._id); }}
            >
              {isOngoing ? <IconPlayerStop size={16} /> : <IconPlayerPlay size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    </Card>
  );
}

export default RoundCard