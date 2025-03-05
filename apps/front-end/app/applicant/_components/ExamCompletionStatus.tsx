import { ExamStatus } from '@agent-xenon/constants';
import { Stack, Title, Text, Paper, Group, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { IconCheck, IconBulb, IconAlarmOff, IconClock } from '@tabler/icons-react';


interface IExamCompletionStatus {
  totalQuestions: number;
  answeredQuestions?: number;
  status?: ExamStatus | 'success';
  roundName: string
}
export const ExamCompletionStatus = ({
  totalQuestions,
  answeredQuestions = totalQuestions,
  status = 'success',
  roundName
}: IExamCompletionStatus) => {
  const completionPercentage = (answeredQuestions / totalQuestions) * 100;
  const statusConfig = {
    success: {
      color: 'indigo',
      icon: IconCheck,
      title: 'Exam Completed!',
      message: `Thank you for completing the ${roundName} exam. Your responses have been submitted successfully.`
    },
    link_expired: {
      color: 'orange',
      icon: IconAlarmOff,
      title: 'Expired Link',
      message: 'This exam link has expired. Please contact your administrator for assistance.'
    },
    exam_completed: {
      color: 'blue',
      icon: IconCheck,
      title: 'Already Completed',
      message: 'You have already completed this exam. No further submissions are required.'
    }
  }[status];
  return (
    <Stack align="center" py={50}>
      {/* Header Section */}
      <ThemeIcon size={80} radius={40} color={statusConfig.color}>
        <statusConfig.icon size={50} />
      </ThemeIcon>

      <Stack align="center" >
        <Title order={1}>{statusConfig.title}</Title>
        <Text c="dimmed" size="lg" ta="center" maw={500}>
          {statusConfig.message}
        </Text>
      </Stack>
      {/* Stats Card - Only show for success status */}
      {status === 'success' && (
        <Paper withBorder p="xl" radius="md" w="100%" maw={500} shadow="sm">
          <Stack >
            <Center>
              <RingProgress
                size={150}
                thickness={12}
                roundCaps
                sections={[{ value: completionPercentage, color: statusConfig.color }]}
                label={
                  <Center>
                    <Stack align="center">
                      <Text fw={700} size="xl">{answeredQuestions}</Text>
                      <Text size="xs" c="dimmed">Questions</Text>
                    </Stack>
                  </Center>
                }
              />
            </Center>
            <Stack>
              <Group>
                <Group>
                  <IconBulb size={20} />
                  <Text size="sm">Total Questions</Text>
                </Group>
                <Text fw={500}>{totalQuestions}</Text>
              </Group>

              <Group>
                <Group>
                  <IconClock size={20} />
                  <Text size="sm">Completion Time</Text>
                </Group>
                <Text fw={500}>Just Now</Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

