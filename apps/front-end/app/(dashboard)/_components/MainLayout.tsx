'use client'
import { AppShell, Box, Burger, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '@/libs/components/layouts/sidebar';
import { UserProfile } from '@/libs/components/layouts/header/UserProfile';
import { useOrganizationStore } from '../../../libs/store/src/lib/organization';
import { useUserStore } from '../../../libs/store/src/lib/user';
import { OrganizationProfile } from '@/libs/components/layouts/header/OrganizationProfile';

interface IMainLayout {
  children: React.ReactNode
}

export default function MainLayout({ children }: IMainLayout) {
  const [opened, { toggle }] = useDisclosure();
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
        <Flex justify="space-between" align="center" h='100%' p='sm'>
          <Box w={272}> 
            <OrganizationProfile organization={organization} />
          </Box>
          <UserProfile userData={user} />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar><Sidebar /></AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
