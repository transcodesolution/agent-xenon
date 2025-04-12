import {
  Container,
  Box,
  Title,
  Text,
  Paper,
  Stack,
  List,
  ThemeIcon,
  Anchor,
  ListItem
} from '@mantine/core';

export default function PrivacyPolicy() {
  return (
    <>
      {/* Privacy Policy Header */}
      <Box bg="blue.9" py={{ base: 'xl', md: '40px' }}>
        <Container size="lg">
          <Title order={1} c="white">Privacy Policy</Title>
          <Text c="blue.0" size="xl" mt="md">
            Our commitment to protecting your data when using Agent Xenon
          </Text>
          <Text c="blue.2" size="sm" mt="xs">
            Effective Date: March 24, 2025
          </Text>
        </Container>
      </Box>

      {/* Privacy Policy Content */}
      <Container size="lg" py="xl">
        <Paper shadow="xs" radius="md" p={{ base: 'md', md: 'xl' }} withBorder>
          <Stack>
            <Text>
              Welcome to Agent Xenon, an AI-powered recruitment automation platform developed to streamline hiring processes across industries. This policy outlines how we collect, use, store, and protect your data when you use our platform.
            </Text>

            <Title order={2} mt="xl">1. Information We Collect</Title>
            <Text>When using Agent Xenon, we collect and process the following types of information:</Text>

            <Title order={3} mt="lg">Job Posting Data</Title>
            <Text>Job title, description, role, designation, and other metadata provided by the organization representative.</Text>

            <Title order={3} mt="lg">Applicant Information</Title>
            <Text>Manually entered or uploaded details including:</Text>
            <List spacing="xs" withPadding>
              <ListItem>Name, email, address, phone number</ListItem>
              <ListItem>Resume/CV and cover letter</ListItem>
              <ListItem>Educational background and professional experience</ListItem>
              <ListItem>Skills, certifications, and other qualifications</ListItem>
            </List>

            <Title order={3} mt="lg">Interview Process Data</Title>
            <List spacing="xs" withPadding>
              <ListItem>Assignment to specific interview rounds (Screening, Assessment, Meeting)</ListItem>
              <ListItem>Evaluation results (AI prompt to evaluate assessment round results), qualification criteria (AI prompt for screening round), interviewer email (organization employee)</ListItem>
              <ListItem>Interview rounds details: cut off margin to clear rounds, round expiry date, interview questions, round type (Screening, Assessment, Meeting)</ListItem>
            </List>

            <Title order={2} mt="xl">2. How We Use the Data</Title>
            <Text>The data collected is used for the following purposes:</Text>
            <List spacing="xs" withPadding>
              <ListItem>Automating the recruitment workflow, including screening, assessments, and meetings</ListItem>
              <ListItem>Matching applicant profiles with job requirements (screening round)</ListItem>
              <ListItem>Enabling resume parsing and manual data entry for applicant tracking</ListItem>
              <ListItem>Storing and organizing candidate information for organization representative review</ListItem>
              <ListItem>Improving hiring efficiency through data-driven recommendations and evaluations</ListItem>
            </List>
            <Text mt="md">We do not sell or share personal applicant data with third-party advertisers.</Text>

            <Title order={2} mt="xl">3. Data Retention</Title>
            <Text>Applicant and job data will be retained for as long as it is required for recruitment purposes or as requested by the organization representative.</Text>
            <Text mt="md">Data can be deleted upon request by the employer or in accordance with the organization&apos;s data retention policies.</Text>

            <Title order={2} mt="xl">4. Data Security</Title>
            <Text>We implement strict security measures to protect your data:</Text>
            <List spacing="xs" withPadding>
              <ListItem>Encrypted storage of sensitive information such as passwords</ListItem>
              <ListItem>Secure access control and user authentication</ListItem>
              <ListItem>Regular security audits and compliance reviews</ListItem>
            </List>

            <Title order={2} mt="xl">5. User Responsibilities</Title>
            <Text>Organization Representative are responsible for ensuring that all uploaded applicant data is obtained legally and with proper consent.</Text>
            <Text mt="md">Applicants are encouraged to verify and review their submitted information.</Text>

            <Title order={2} mt="xl">6. Compliance</Title>
            <Text>Agent Xenon complies with applicable data protection regulations, including but not limited to:</Text>
            <List spacing="xs" withPadding>
              <ListItem>General Data Protection Regulation (GDPR)</ListItem>
              <ListItem>Information Technology Act, 2000 (India), where applicable</ListItem>
              <ListItem>Other local or industry-specific privacy standards</ListItem>
            </List>

            <Title order={2} mt="xl">7. Contact Us</Title>
            <Text>For questions about this policy or to request data removal:</Text>
            <Text mt="md">Email: <Anchor href="mailto:support@transcodesolution.com">support@transcodesolution.com</Anchor></Text>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
