import { IMCQOptions } from '@agent-xenon/interfaces';
import { Box, Text, Paper, Stack, Checkbox, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface IMcqAnswer {
  options: IMCQOptions[];
  selectedAnswer: string;
}

export const McqAnswer = ({ options, selectedAnswer }: IMcqAnswer) => {
  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">Applicants's Answer:</Text>
      <Stack>
        {options.map((option) => {
          const isSelected = selectedAnswer.length > 0 && selectedAnswer.includes(option.index); // Ensure it's not empty
          const isCorrect = option.isRightAnswer;
          const isIncorrectSelection = isSelected && !isCorrect;

          return (
            <Paper
              key={option.index}
              p="md"
              shadow="xs"
              radius="md"
              withBorder
              bg={isSelected ? (isCorrect ? 'green.0' : 'red.1') : 'white'}
              styles={{ root: { border: `1px solid ${isSelected ? (isCorrect ? "green" : 'red') : 'white'}` } }}
            >
              <Group>
                <Checkbox
                  checked={isSelected}
                  label={option.text}
                  color={isSelected ? (isCorrect ? 'green' : 'red') : 'gray'}
                  readOnly
                />
                {isIncorrectSelection && <IconAlertCircle size={20} color="red" />}
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};
