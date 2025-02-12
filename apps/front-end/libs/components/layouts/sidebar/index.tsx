'use client'
import {
  IconNotes,
} from '@tabler/icons-react';
import { Box, Flex } from '@mantine/core';
import { LinksGroup } from './components/NavbarLinksGroup';
import { UserButton } from './components/UserButton';
import classes from './sidebar.module.scss';

const mockData = [
  {
    label: 'Recruitment',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Jobs', link: '/jobs' },
      { label: 'Candidates', link: '/candidates' },
      { label: 'Q&A', link: '/qa' },
    ],
  }
];

export const Sidebar = () => {
  const links = mockData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Flex direction='column' justify='space-between' h='100%'>
      <Box px='sm'>{links}</Box>
      <Box p='sm' className={classes.footer}>
        <UserButton />
      </Box>
    </Flex>
  );
}