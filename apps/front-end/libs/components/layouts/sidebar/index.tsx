'use client'
import {
  IconNotes,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { Flex } from '@mantine/core';
import { LinksGroup } from './components/NavbarLinksGroup';
import { Permission } from '@agent-xenon/constants';

const mockData = [
  {
    label: 'Recruitment',
    icon: IconNotes,
    initiallyOpened: false,
    permissions: [Permission.JOB_READ, Permission.QUESTION_ANSWER_READ],
    links: [
      { label: 'Jobs', link: '/jobs', permissions: [Permission.JOB_READ] },
      { label: 'Candidates', link: '/candidates',permissions: [Permission.JOB_READ] },
      { label: 'Q&A', link: '/questions', permissions: [Permission.QUESTION_ANSWER_READ] },
    ],
  },
  {
    label: 'Roles',
    icon: IconUserCircle,
    initiallyOpened: false,
    permissions: [Permission.ROLE_READ],
    links: [
      { label: 'Roles', link: '/roles', permissions: [Permission.ROLE_READ] },
    ],
  },
  {
    label: 'Users',
    icon: IconUser,
    initiallyOpened: false,
    permissions: [Permission.ROLE_READ],
    links: [
      { label: 'Users', link: '/users',permissions: [Permission.ROLE_READ] },
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