import { Container, Group, Title, Anchor, Text, Image } from '@mantine/core';
import Link from "next/link";

export const Header = () => {

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Privacy Policy', href: '/privacy-policy' }
  ];

  return (
    <Container size="lg" px="md" py="md" >
      <Group justify="space-between">
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

        <Group gap="xl" visibleFrom="sm">
          {links.map((link) => (
            <Anchor key={link.label} href={link.href} underline="never" component={Link} c="gray.7">
              {link.label}
            </Anchor>
          ))}
        </Group>
      </Group>
    </Container>
  );
}
