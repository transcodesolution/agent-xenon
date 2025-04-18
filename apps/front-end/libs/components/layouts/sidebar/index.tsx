'use client';

import {
  IconApps,
  IconBook,
  IconHome,
  IconNotes,
  IconUserCircle,
  IconUsers,
  IconUsersGroup,
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
      { label: 'Applicants', link: '/applicants', permissions: [Permission.JOB_READ] },
      { label: 'Interview Questions', link: '/interview-questions', permissions: [Permission.QUESTION_ANSWER_READ] },
      { label: 'Job Roles', link: '/job-roles', permissions: [Permission.ROLE_READ] },
      { label: 'Designation', link: '/designation', permissions: [Permission.DESIGNATION_READ] },
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
    icon: IconUsers,
    permissions: [Permission.USER_READ],
    link: '/users',
  },
  {
    label: 'Employees',
    icon: IconUsersGroup,
    permissions: [Permission.EMPLOYEE_READ],
    link: '/employee',
  },
  {
    label: 'App',
    icon: IconApps,
    permissions: [Permission.READ_APP_INFO],
    link: '/apps',
  },
  {
    label: 'Training',
    icon: IconBook,
    permissions: [Permission.JOB_READ],
    link: '/trainings',
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
