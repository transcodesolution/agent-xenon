'use client'
import {
  IconNotes,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { Flex } from '@mantine/core';
import { LinksGroup } from './components/NavbarLinksGroup';

const mockData = [
  {
    label: 'Recruitment',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Jobs', link: '/jobs' },
      { label: 'Candidates', link: '/candidates' },
      { label: 'Q&A', link: '/questions' },
    ],
  },
  {
    label: 'Roles',
    icon: IconUserCircle,
    initiallyOpened: false,
    links: [
      { label: 'Roles', link: '/roles' },
    ],
  },
  {
    label: 'Users',
    icon: IconUser,
    initiallyOpened: false,
    links: [
      { label: 'Users', link: '/users' },
    ],
  },
];

export const Sidebar = () => {
  const links = mockData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Flex direction='column' h='100%' p='sm'>
      {links}
    </Flex>
  );
}