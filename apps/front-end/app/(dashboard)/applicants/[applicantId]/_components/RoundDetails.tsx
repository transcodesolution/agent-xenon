import { Box, Text, Title, Badge, Card, Group, Divider } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { QuestionTabs } from './QuestionTabs';
import { IApplicantInterviewRound, IApplicantQuestionAnswer } from '@agent-xenon/interfaces';
import { getStatusColor } from '@/libs/utils/ui-helpers';
import dayjs from 'dayjs';

interface IInterviewRoundDetails {
  selectedInterviewRound: IApplicantInterviewRound | [];
  roundDetails: IApplicantQuestionAnswer | [];
}

export const RoundDetails = ({ selectedInterviewRound, roundDetails }: IInterviewRoundDetails) => {
  if (!selectedInterviewRound || Array.isArray(selectedInterviewRound)) {
    return (
      <Card withBorder radius="md" p="xl" shadow="sm">
        <Text ta="center" fs="italic" c="dimmed">
          Please select a round to view details
        </Text>
      </Card>
    );
  }


  return (
    <Card withBorder radius="md" p="md" shadow="sm">
      <Title order={3} mb="md">{selectedInterviewRound?.name}</Title>
      <Group mb="md">
        <Group>
          <IconCalendar size={16} />
          <Text size="sm">
            {dayjs(selectedInterviewRound.startDate).format('DD-MM-YYYY | HH:mm')} - {dayjs(selectedInterviewRound.endDate).format('DD-MM-YYYY | HH:mm')}
          </Text>
        </Group>

        <Group >
          <Badge color={getStatusColor(selectedInterviewRound.status)} variant="light">
            Round: {selectedInterviewRound.status}
          </Badge>

          {selectedInterviewRound.applicantStatus && (
            <Badge color={getStatusColor(selectedInterviewRound.applicantStatus)} variant="filled">
              Applicant: {selectedInterviewRound.applicantStatus}
            </Badge>
          )}
        </Group>
      </Group>

      <Box>
        <Text fw={500} size="sm">Selection Criteria:</Text>
        <Text size="sm">{selectedInterviewRound.selectionMarginInPercentage}% pass rate required</Text>
      </Box>

      <Divider my="md" />

      {roundDetails ? (
        <QuestionTabs questions={Array.isArray(roundDetails) ? roundDetails : [roundDetails]} />
      ) : (
        <Text ta="center" fs="italic" c="dimmed" py="md">
          Loading questions...
        </Text>
      )}
    </Card>
  );
}