import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { Icon, IconChevronRight, IconProps } from '@tabler/icons-react';
import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from '../sidebar.module.scss';
import Link from 'next/link';
import { Permission } from '@agent-xenon/constants';
import { checkPermissions } from '@/libs/store/src';

interface LinksGroupProps {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string, permissions?: Permission[] }[];
  permissions?: Permission[]
}

export const LinksGroup = ({ icon: Icon, label, initiallyOpened, links, permissions = [] }: LinksGroupProps) => {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => {

    const isAllowedToAccess = checkPermissions({ permissions: link.permissions || [] })
    if (!isAllowedToAccess) return null;
    return (
      <Link
        href={link.link}
        key={link.label}
        className={classes.link}
      >
        {link.label}
      </Link>
    )
  });
  
  const isAllowedToAccess = checkPermissions({ permissions, isPartial: true })
  if (!isAllowedToAccess) {
    return null;
  }

  return (
    <div>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control} p='xs'>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={16} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened} style={{ paddingBlock: '.5rem' }}>{items}</Collapse> : null}
    </div>
  );
}