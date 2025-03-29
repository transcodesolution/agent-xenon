import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { Icon, IconChevronRight, IconProps } from '@tabler/icons-react';
import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import classes from '../sidebar.module.scss';
import { Permission } from '@agent-xenon/constants';
import { checkPermissions } from '@/libs/store/src';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface LinksGroupProps {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; permissions?: Permission[] }[];
  permissions?: Permission[];
}

export const LinksGroup = ({ icon: Icon, label, initiallyOpened, links = [], permissions = [] }: LinksGroupProps) => {
  const [opened, setOpened] = useState(initiallyOpened || false);
  const isAllowedToAccess = checkPermissions({ permissions, isPartial: true });
  const pathname = usePathname();

  if (!isAllowedToAccess || links.length === 0) return null;

  return (
    <div>
      <UnstyledButton onClick={() => setOpened(!opened)} className={classes.control} p="xs">
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={36}>
              <Icon size={20} />
            </ThemeIcon>
            <Box ml="md" className={classes.linkText}>{label}</Box>
          </Box>
          <IconChevronRight
            className={classes.chevron}
            stroke={1.5}
            size={18}
            style={{ transform: opened ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s ease' }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened} className={classes.collapse}>
        {links.map((linkItem) =>
          checkPermissions({ permissions: linkItem.permissions || [] }) ? (
            <Link href={linkItem.link} key={linkItem.label} className={clsx(classes.link, { [classes.active]: pathname === linkItem.link })}
            >
              {linkItem.label}
            </Link>
          ) : null
        )}
      </Collapse>
    </div>
  );
};
