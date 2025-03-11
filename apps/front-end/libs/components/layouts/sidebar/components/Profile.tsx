import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react';
import { Avatar, Group, Menu, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from '../sidebar.module.scss';
import { IRole, IUser } from '@agent-xenon/interfaces';
import { logout } from '@/libs/web-apis/src';

interface IProfileData {
  userData?: IUser;
}

export const Profile = ({ userData }: IProfileData) => {
  const router = useRouter();

  const userBadge = userData?.firstName && userData?.lastName
    ? `${userData.firstName[0] ?? ''}${userData.lastName[0] ?? ''}`.toUpperCase()
    : '';

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Menu position="bottom-end" withArrow width={200}>
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar color="blue" radius="xl"> {userBadge}</Avatar>
            <IconChevronDown size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser size={14} />}
          onClick={() => router.push('/profile')}
        >
          Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};