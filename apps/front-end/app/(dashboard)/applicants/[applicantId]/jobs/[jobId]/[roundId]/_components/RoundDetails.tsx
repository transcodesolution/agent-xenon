'use client'
import { Box, Text, Title, Badge, Card, Group, Divider, LoadingOverlay } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { QuestionTabs } from './QuestionTabs';
import { getStatusColor } from '@/libs/utils/ui-helpers';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useGetApplicantInterviewRoundDetails } from '@/libs/react-query-hooks/src';

export const RoundDetails = () => {
  const { roundId, applicantId } = useParams<{ roundId: string; applicantId: string }>();
  const { data: getRoundDetailsResponse, isLoading } = useGetApplicantInterviewRoundDetails({
    roundId: roundId ?? "",
    applicantId: applicantId,
    enabled: !!roundId,
  });
  const roundDetails = getRoundDetailsResponse?.data?.applicantRoundAndQuestionAnswers ?? [];
  const interviewRound = getRoundDetailsResponse?.data?.interviewRound;


  if (!interviewRound || Array.isArray(interviewRound)) {
    return (
      <Card withBorder radius="md" p="xl" shadow="sm">
        <Text ta="center" fs="italic" c="dimmed">
          Please select a round to view details
        </Text>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingOverlay visible />
  }

  return (
    <Card withBorder radius="md" p="md" shadow="sm">
      <Title order={3} mb="md">{interviewRound?.name}</Title>
      <Group mb="md" justify='space-between'>
        <Group>
          <IconCalendar size={16} />
          <Text size="sm">
            {dayjs(interviewRound.startDate).format('DD-MM-YYYY | HH:mm')} - {dayjs(interviewRound.endDate).format('DD-MM-YYYY | HH:mm')}
          </Text>
        </Group>

        <Group >
          <Badge color={getStatusColor(interviewRound.status)} variant="light">
            Round: {interviewRound.status}
          </Badge>

          {interviewRound.applicantStatus && (
            <Badge color={getStatusColor(interviewRound.applicantStatus)} variant="filled">
              Applicant: {interviewRound.applicantStatus}
            </Badge>
          )}
        </Group>
      </Group>

      <Box>
        <Text fw={500} size="sm">Selection Criteria:</Text>
        <Text size="sm">{interviewRound.selectionMarginInPercentage}% pass rate required</Text>
      </Box>

      <Divider my="md" />
      <QuestionTabs questions={Array.isArray(roundDetails) ? roundDetails : [roundDetails]} />
    </Card>
  );
}