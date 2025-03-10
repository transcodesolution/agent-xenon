'use client'
import { AppShell, Box, Burger, Flex, Text, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '@/libs/components/layouts/sidebar';
import { Profile, } from '@/libs/components/layouts/sidebar/components/Profile';
import { IconEdit } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useOrganizationStore } from '../store/useOrganizationStore';
import { useUserStore } from '../store/useUserStore';

interface IMainLayout {
  children: React.ReactNode
}

export default function MainLayout({ children }: IMainLayout) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const { organization } = useOrganizationStore();
  const { user } = useUserStore();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Flex justify="space-between" align="center" p="sm">
          <Flex align="center" gap="sm">
            <Text size="lg" fw={600} w={245} lineClamp={1}>{organization?.name}</Text>
            <ActionIcon
              variant="subtle"
              onClick={() => router.push('/organization')}
              aria-label="Edit Organization"
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Flex>
          <Box>
            <Profile userData={user} />
          </Box>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar py='sm'><Sidebar /></AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
