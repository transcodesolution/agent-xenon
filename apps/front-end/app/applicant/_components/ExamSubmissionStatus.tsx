import { Stack, Title, Text, Paper, Group, RingProgress, Center, ThemeIcon } from "@mantine/core";
import { IconCheck, IconBulb, IconClock } from "@tabler/icons-react";

interface IExamSubmissionStatus {
  totalQuestions: number;
  answeredQuestions: number;
  roundName: string;
}

export const ExamSubmissionStatus = ({
  totalQuestions,
  answeredQuestions,
  roundName,
}: IExamSubmissionStatus) => {

  const completionPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <Stack align="center" py={50}>
      <ThemeIcon size={80} radius={40} color="indigo">
        <IconCheck size={50} />
      </ThemeIcon>

      <Stack align="center">
        <Title order={1}>Exam Submitted!</Title>
        <Text c="dimmed" size="lg" ta="center" maw={500}>
          Thank you for completing the {roundName} exam. Your responses have been submitted successfully.
        </Text>
      </Stack>

      {/* Completion Progress */}
      <Paper withBorder p="xl" radius="md" w="100%" maw={500} shadow="sm">
        <Stack>
          <Center>
            <RingProgress
              size={150}
              thickness={12}
              roundCaps
              sections={[{ value: completionPercentage, color: "indigo" }]}
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
              <IconBulb size={20} />
              <Text size="sm">Total Questions</Text>
              <Text fw={500}>{totalQuestions}</Text>
            </Group>

            <Group>
              <IconClock size={20} />
              <Text size="sm">Completion Time</Text>
              <Text fw={500}>Just Now</Text>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};
