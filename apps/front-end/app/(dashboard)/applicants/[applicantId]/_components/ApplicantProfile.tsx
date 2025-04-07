import { Card, Avatar, Text, Group, Badge, Divider, List, Box, Tabs, Flex } from '@mantine/core';
import { IconAt, IconPhone, IconMapPin } from '@tabler/icons-react';
import { IApplicant } from '@agent-xenon/interfaces';

interface IApplicantProfile {
  applicant?: IApplicant;
}

export const ApplicantProfile = ({ applicant }: IApplicantProfile) => {
  if (!applicant) {
    return (
      <Card withBorder p="md" radius="md" shadow="sm">
        <Text ta="center" fs="italic" c="dimmed">
          Loading applicant...
        </Text>
      </Card>
    );
  }

  return (
    <Card withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between">
        <Group>
          <Avatar color="blue" radius="xl" size="lg">
            {applicant.firstName.charAt(0)}
          </Avatar>
          <Text fw={700} size="lg">{`${applicant.firstName} ${applicant.lastName}`}</Text>
        </Group>
      </Group>

      <Divider my="sm" />

      {applicant.summary && (
        <Box mb="md">
          <Text fw={500} mb="xs">Summary</Text>
          <Text size="sm">{applicant.summary}</Text>
        </Box>
      )}

      <Box mb='sm'>
        <Text fw={500} mb="xs">Contact Information</Text>
        <Group mb="xs">
          <IconAt size={16} />
          <Text size="sm">{applicant.contactInfo.email}</Text>
        </Group>

        <Group mb="xs">
          <IconPhone size={16} />
          <Text size="sm">{applicant.contactInfo.phoneNumber}</Text>
        </Group>

        <Group mb="xs">
          <IconMapPin size={16} />
          <Text size="sm">{`${applicant.contactInfo.address}, ${applicant.contactInfo.city}, ${applicant.contactInfo.state}`}</Text>
        </Group>
      </Box>

      <Tabs defaultValue="skills" >
        <Tabs.List grow>
          <Tabs.Tab value="skills">Skills</Tabs.Tab>
          <Tabs.Tab value="hobbies">Hobbies</Tabs.Tab>
          <Tabs.Tab value="strengths">Strengths</Tabs.Tab>
          <Tabs.Tab value="education">Education</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="skills" pt="md">
          <Flex gap="xs" wrap="wrap">
            {applicant.skills.length > 0 ? (
              applicant.skills.map((skill, index) => (
                <Badge key={index} variant="outline" color="blue">
                  {skill}
                </Badge>
              ))
            ) : (
              <Text size="sm" c="dimmed">No skills available</Text>
            )}
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="hobbies" pt="md">
          <Flex gap="xs" wrap="wrap">
            {applicant.hobbies.length > 0 ? (
              applicant.hobbies.map((hobby, index) => (
                <Badge key={index} variant="light" color="grape">
                  {hobby}
                </Badge>
              ))
            ) : (
              <Text size="sm" c="dimmed">No hobbies available</Text>
            )}
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="strengths" pt="md">
          <Flex gap="xs" wrap="wrap">
            {applicant.strengths.length > 0 ? (
              applicant.strengths.map((strength, index) => (
                <Badge key={index} variant="filled" color="green">
                  {strength}
                </Badge>
              ))
            ) : (
              <Text size="sm" c="dimmed">No strengths available</Text>
            )}
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="education" pt="md">
          <List>
            {applicant.education.length > 0 ? (
              applicant.education.map((edu, index) => (
                <List.Item key={index}>
                  <Text fw={500}>{edu.degree}</Text>
                  <Text size="sm">{edu.institution} ({edu.yearOfGraduation})</Text>
                  {edu.description && <Text size="sm">{edu.description}</Text>}
                </List.Item>
              ))
            ) : (
              <Text size="sm" c="dimmed">No education details available</Text>
            )}
          </List>
        </Tabs.Panel>

        <Tabs.Panel value="projects" pt="md">
          <List>
            {applicant.projects.length > 0 ? (
              applicant.projects.map((project, index) => (
                <List.Item key={index}>
                  <Text fw={500}>{project.title}</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(project.durationStart).toLocaleDateString()} - {new Date(project.durationEnd).toLocaleDateString()}
                  </Text>
                  <Text size="sm">
                    <strong>Technologies:</strong> {project.technologiesUsed.join(', ')}
                  </Text>
                  <Text size="sm">{project.description}</Text>
                </List.Item>
              ))
            ) : (
              <Text size="sm" c="dimmed">No projects available</Text>
            )}
          </List>
        </Tabs.Panel>
      </Tabs>

      {applicant.salaryExpectation > 0 && (
        <>
          <Divider my="sm" />
          <Group>
            <Text fw={500}>Expected Salary:</Text>
            <Text>${applicant.salaryExpectation.toLocaleString()}/year</Text>
          </Group>
        </>
      )}
    </Card>
  );
};
