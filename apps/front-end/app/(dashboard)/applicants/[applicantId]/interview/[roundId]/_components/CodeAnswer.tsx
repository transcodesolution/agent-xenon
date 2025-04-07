import { Box, Text } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';

interface ICodeAnswer {
  code: string;
}

export const CodeAnswer = ({ code }: ICodeAnswer) => {
  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">Applicants's Solution:</Text>
      <CodeHighlight withCopyButton={false} code={code} language="tsx" />
    </Box>
  );
}

