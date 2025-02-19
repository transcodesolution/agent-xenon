'use client'
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '@/libs/components/layouts/sidebar';
interface IMainLayout {
  children: React.ReactNode
}

export default function MainLayout({ children }: IMainLayout) {
  const [opened, { toggle }] = useDisclosure();

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
        This will be the header
      </AppShell.Header>

      <AppShell.Navbar py='sm'><Sidebar /></AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
