import { Container, Title, Text, Group, SimpleGrid, ThemeIcon, Stack, Paper } from '@mantine/core';
import { IconBriefcase, IconCalendar, IconChartBar, IconShieldCheck } from '@tabler/icons-react';

const features = [
  {
    name: "Automated Screening",
    description: "Our AI automatically screens candidates based on your requirements, saving you hours of manual work.",
    icon: IconBriefcase,
  },
  {
    name: "Secure Data Handling",
    description: "GDPR compliant platform with strict security measures to protect candidate and company data.",
    icon: IconShieldCheck,
  },
  {
    name: "Structured Interview Process",
    description: "Organize your hiring pipeline with customizable screening, assessment, and meeting rounds.",
    icon: IconCalendar,
  },
  {
    name: "Data-Driven Insights",
    description: "Make better hiring decisions with AI-powered candidate evaluations and recruitment analytics.",
    icon: IconChartBar,
  },
];

export const Features = () => {
  return (
    <Container id="features" size="lg" py="xl">
      <Stack ta="center" gap="xs" mb={40}>
        <Text c="blue.9" fw={700} size='xl'>Features</Text>
        <Title size="2.5rem">A better way to hire</Title>
        <Text c="gray.7" size="lg" maw={600} mx="auto">
          Agent Xenon simplifies your recruitment process from job posting to final selection.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={30}>
        {features.map((feature) => (
          <Paper withBorder p="lg" radius="md" key={feature.name}>
            <Group>
              <ThemeIcon size={50} radius="md" color="blue.9">
                <feature.icon size={24} />
              </ThemeIcon>

              <Stack gap="xs">
                <Text fw={700} size="lg">{feature.name}</Text>
                <Text c="gray.7">{feature.description}</Text>
              </Stack>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>
    </Container >
  );
}
