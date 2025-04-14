import { Group, Container, Text, Anchor, Divider, Stack, Title, Image } from '@mantine/core';
import { IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";
import Link from 'next/link';

const navigation = {
  platform: [
    { name: 'Features', href: '/#features' },
    { name: 'How it works', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: 'https://www.agentxenon.com/privacy-policy' },
    { name: 'Terms of Service', href: '#' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: IconBrandTwitter,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: IconBrandLinkedin,
    },
  ],
};

export const Footer = () => {
  return (
    <Container size="lg" py="md">
      <Group justify="space-between" py="lg">
        <Stack>
          <Anchor underline="never" component={Link} href="/">
            <Group gap="xs" styles={{ root: { cursor: "pointer" } }}>
              <Image
                src="/assets/images/logo.svg"
                alt="Agent Xenon Logo"
                style={{ width: '40px', height: '40px' }}
              />
              <Title order={2} fw={700} c="#000">
                Agent <Text span c="var(--mantine-color-blue-9)" inherit>Xenon</Text>
              </Title>
            </Group>
          </Anchor>
          <Text c="gray.6" size="sm">
            Transforming recruitment with AI-powered intelligence for better, faster hiring decisions.
          </Text>
          <Group>
            {navigation.social.map((item) => (
              <Anchor key={item.name} href={item.href} c="gray.6" target="_blank">
                <item.icon size={20} />
              </Anchor>
            ))}
          </Group>
        </Stack>

        <Stack>
          <Title order={6} c="gray.6" tt="uppercase">Platform</Title>
          <Stack gap="xs">
            {navigation.platform.map((item) => (
              <Anchor component={Link} c="gray.7" size="sm" key={item.name} href={item.href}>
                {item.name}
              </Anchor>
            ))}
          </Stack>
        </Stack>

        <Stack>
          <Title order={6} c="gray.6" tt="uppercase">Legal</Title>
          <Stack gap="xs">
            {navigation.legal.map((item) => (
              <Anchor component={Link} c="gray.7" size="sm" key={item.name} href={item.href}>
                {item.name}
              </Anchor>
            ))}
          </Stack>
        </Stack>
      </Group>

      <Divider my="sm" />
      <Text ta="center" c="gray.6" size="sm" py="md">
        &copy; 2025 Agent Xenon, Inc. All rights reserved.
      </Text>
    </Container>
  );
}
