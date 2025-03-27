'use client';

import {
  IconHome,
  IconNotes,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { Flex, Box, ThemeIcon } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinksGroup } from './components/NavbarLinksGroup';
import { Permission } from '@agent-xenon/constants';
import { checkPermissions } from '@/libs/store/src';
import classes from '../sidebar/sidebar.module.scss';
import { clsx } from 'clsx';

const mockData = [
  {
    label: 'Dashboard',
    icon: IconHome,
    permissions: [Permission.JOB_READ, Permission.QUESTION_ANSWER_READ],
    link: '/dashboard',
  },
  {
    label: 'Recruitment',
    icon: IconNotes,
    permissions: [Permission.JOB_READ, Permission.QUESTION_ANSWER_READ],
    links: [
      { label: 'Jobs', link: '/jobs', permissions: [Permission.JOB_READ] },
      { label: 'Candidates', link: '/candidates', permissions: [Permission.JOB_READ] },
      { label: 'Q&A', link: '/questions', permissions: [Permission.QUESTION_ANSWER_READ] },
    ],
  },
  {
    label: 'Roles',
    icon: IconUserCircle,
    permissions: [Permission.ROLE_READ],
    link: '/roles',
  },
  {
    label: 'Users',
    icon: IconUser,
    permissions: [Permission.ROLE_READ],
    link: '/users',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const filteredData = mockData.filter((item) =>
    item.link
      ? checkPermissions({ permissions: item.permissions, isPartial: true })
      : item.links?.some((subItem) =>
        checkPermissions({ permissions: subItem.permissions || [], isPartial: true })
      )
  );

  return (
    <Flex direction="column" h="100%" p="sm">
      {filteredData.map((item) =>
        item.link ? (
          <Link
            href={item.link}
            key={item.label}
            className={clsx(classes.sidebarLink, { [classes.active]: pathname === item.link })}
          >
            <Box style={{ display: 'flex', alignItems: 'center' }} p="xs">
              <ThemeIcon variant="light" size={36}>
                <item.icon size={20} />
              </ThemeIcon>
              <Box ml="md" className={classes.linkText}>{item.label}</Box>
            </Box>
          </Link>
        ) : (
          <LinksGroup {...item} key={item.label} />
        )
      )}
    </Flex>
  );
};
