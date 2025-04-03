import { Text, Card } from '@mantine/core';

export default function Page() {
  return (
    <Card withBorder radius="md" p="xl" shadow="sm">
      <Text ta="center" fs="italic" c="dimmed">
        Please select a round to view details
      </Text>
    </Card>
  );
}
