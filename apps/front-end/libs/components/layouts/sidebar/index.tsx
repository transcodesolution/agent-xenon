'use client'
import {
  IconNotes,
  IconUser,
} from '@tabler/icons-react';
import { Box, Flex } from '@mantine/core';
import { LinksGroup } from './components/NavbarLinksGroup';

const mockData = [
  {
    label: 'Recruitment',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Jobs', link: '/jobs' },
      { label: 'Candidates', link: '/candidates' },
      { label: 'Q&A', link: '/qa' },
    ],
  },
  {
    label: 'Roles',
    icon: IconUser,
    initiallyOpened: false,
    links: [
      { label: 'Roles', link: '/roles' },
    ],
  },
];

export const Sidebar = () => {
  const links = mockData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Flex direction='column' justify='space-between' h='100%'>
      <Box px='sm'>{links}</Box>
    </Flex>
  );
}