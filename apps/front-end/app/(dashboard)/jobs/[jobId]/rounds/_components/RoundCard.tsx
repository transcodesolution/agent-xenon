import { getRoundTypeColor, getStatusColor } from '@/libs/utils/ui-helpers';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import { IInterviewRound } from '@agent-xenon/interfaces';
import { ActionIcon, Badge, Card, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconClock, IconPlayerPlay, IconPlayerStop, IconUsers, IconUserCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface IRoundCardList {
  round: IInterviewRound;
  isDisabled?: boolean;
  onStartRound?: (roundId: string) => void;
  onUpdateRoundStatus?: (roundId: string, newStatus: string) => void;
  onShowApplicants: (roundId: string) => void;
}

export const RoundCard = ({ round, isDisabled, onStartRound, onUpdateRoundStatus, onShowApplicants }: IRoundCardList) => {
  const isOngoing = round.status === InterviewRoundStatus.ONGOING;
  const isYetToStart = round.status === InterviewRoundStatus.YET_TO_START;
  const isPaused = round.status === InterviewRoundStatus.PAUSED;

  return (
    <Card withBorder radius="md" p="lg">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between" wrap="nowrap">
          <Stack>
            <Text fw='600' size='xl'> {round.name || "-"}</Text>
          </Stack>

          <Group gap="xs">
            <Tooltip label={`Duration: ${dayjs(round.endDate).format('DD-MM-YYYY | HH:mm')}`}>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{dayjs(round.endDate).format('DD-MM-YYYY | HH:mm')}</Text>
              </Group>
            </Tooltip>

            <Tooltip label="View Applicants">
              <ActionIcon variant="subtle" onClick={() => onShowApplicants(round._id)}>
                <IconUsers size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>

      <Text size="sm" c="dimmed" lineClamp={2}>{round.qualificationCriteria || "-"}</Text>

      <Flex justify='space-between' gap="md" mt="md">
        <Group>
          <Badge color={getRoundTypeColor(round.type)} size="lg" variant="light">
            {round.type.charAt(0).toUpperCase() + round.type.slice(1)}
          </Badge>
          <Badge color={getStatusColor(round.status)} size="lg" variant="dot">
            {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
          </Badge>
        </Group>

        <Group>
          {isYetToStart && (
            <Tooltip label="Start Round">
              <ActionIcon
                size="xl"
                variant="light"
                color="green"
                disabled={isDisabled}
                onClick={() => onStartRound?.(round._id)}
              >
                <IconPlayerPlay size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {isOngoing && (
            <Tooltip label="Pause Round">
              <ActionIcon
                size="xl"
                variant="light"
                color="red"
                disabled={isDisabled}
                onClick={() => onUpdateRoundStatus?.(round._id, 'paused')}
              >
                <IconPlayerStop size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {isPaused && (
            <Tooltip label="Resume Round">
              <ActionIcon
                size="xl"
                variant="light"
                color="orange"
                disabled={isDisabled}
                onClick={() => onUpdateRoundStatus?.(round._id, 'ongoing')}
              >
                <IconPlayerPlay size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {(isOngoing || isPaused) && (
            <Tooltip label="Complete Round">
              <ActionIcon
                size="xl"
                variant="light"
                color="blue"
                disabled={isDisabled}
                onClick={() => onUpdateRoundStatus?.(round._id, 'completed')}
              >
                <IconUserCheck size={22} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Flex>
    </Card>
  );
};
