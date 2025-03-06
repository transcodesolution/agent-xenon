import { ExamStatus } from "@agent-xenon/constants";
import { Stack, Title, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconAlarmOff } from "@tabler/icons-react";

interface IExamStatusAlert {
  status?: ExamStatus;
}

export const ExamStatusAlert = ({ status }: IExamStatusAlert) => {
  if (!status) return null;

  const statusConfig = {
    link_expired: {
      color: "red",
      icon: IconAlarmOff,
      title: "Expired Link",
      message:
        "This exam link has expired. Please contact your administrator for assistance.",
    },
    exam_completed: {
      color: "blue",
      icon: IconCheck,
      title: "Already Completed",
      message:
        "You have already completed this exam. No further submissions are required.",
    },
  }[status];

  if (!statusConfig) return null;

  return (
    <Stack align="center" py={50}>
      <ThemeIcon size={80} radius={40} color={statusConfig.color}>
        <statusConfig.icon size={50} />
      </ThemeIcon>
      <Stack align="center">
        <Title order={1}>{statusConfig.title}</Title>
        <Text c="dimmed" size="lg" ta="center" maw={500}>
          {statusConfig.message}
        </Text>
      </Stack>
    </Stack>
  );
};
