'use client'
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
interface IMainLayout {
  children: React.ReactNode
}

export default function ApplicantMainLayout({ children }: IMainLayout) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
   
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}