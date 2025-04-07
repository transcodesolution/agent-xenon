import { Box, Text, Paper } from '@mantine/core';

interface ITextAnswer {
  answer: string;
}

export const TextAnswer = ({ answer }: ITextAnswer) => {
  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">Applicants's Answer:</Text>
      <Paper p="md" withBorder>
        <Text>{answer}</Text>
      </Paper>
    </Box>
  );
}