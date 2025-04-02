import { useGetApplicantInterviewRounds } from '@agent-xenon/react-query-hooks';
import { getStatusColor } from '@/libs/utils/ui-helpers';
import { Text, Paper, Badge, Group, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';

export const InterviewRoundsList = () => {
  const { applicantId, roundId } = useParams<{ applicantId: string, roundId: string }>();
  const { data: applicantInterviewRounds } = useGetApplicantInterviewRounds({ applicantId: applicantId });
  const rounds = applicantInterviewRounds?.data?.applicantInterviewRounds || []
  const router = useRouter();

  const handleSelectRound = (roundId: string) => {
    router.push(`/applicants/${applicantId}/interview/${roundId}`);
  };

  return (
    <Stack h='calc(100vh - 190px)' styles={{ root: { overflowY: 'auto' } }}>
      {rounds.map((round) => (
        <Paper
          key={round._id}
          p="md"
          withBorder
          shadow={roundId === round._id ? 'md' : 'sm'}
          style={{
            cursor: 'pointer',
            borderColor: roundId === round._id ? 'var(--mantine-color-blue-6)' : undefined,
          }}
          onClick={() => handleSelectRound(round._id)}
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