import { getStatusColor } from '@/libs/utils/ui-helpers';
import { IApplicantInterviewRound } from '@agent-xenon/interfaces';
import { Text, Paper, Badge, Group, Stack } from '@mantine/core';
import dayjs from 'dayjs';

interface InterviewRoundsList {
  rounds: IApplicantInterviewRound[];
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
}

export const InterviewRoundsList = ({ rounds, selectedRoundId, onSelectRound }: InterviewRoundsList) => {
  return (
    <Stack h='calc(100vh - 190px)' styles={{ root: { overflowY: 'auto' } }}>
      {rounds.map((round) => (
        <Paper
          key={round._id}
          p="md"
          withBorder
          shadow={selectedRoundId === round._id ? 'md' : 'sm'}
          style={{
            cursor: 'pointer',
            borderColor: selectedRoundId === round._id ? 'var(--mantine-color-blue-6)' : undefined,
          }}
          onClick={() => onSelectRound(round._id)} // Pass only the round ID
        >
          <Group mb="xs">
            <Text fw={600}>{round.name}</Text>
            <Badge color={getStatusColor(round.status)} variant="light">
              {round.status}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" mb="xs">
            {round.type}
          </Text>

          <Group>
            <Text size="sm">
              {dayjs(round.startDate).format('DD-MM-YYYY | HH:mm')} - {dayjs(round.endDate).format('DD-MM-YYYY | HH:mm')}
            </Text>

            {round.applicantStatus && (
              <Badge size="sm" color={getStatusColor(round.applicantStatus)} variant="filled">
                {round.applicantStatus}
              </Badge>
            )}
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}