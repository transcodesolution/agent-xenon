import { IconLogout, IconUser } from '@tabler/icons-react';
import { Avatar, Menu } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IUser } from '@agent-xenon/interfaces';
import { logout } from '@/libs/web-apis/src';

interface IUserProfile {
  userData?: IUser;
}

export const UserProfile = ({ userData }: IUserProfile) => {
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
    <Menu position='bottom' offset={2}>
      <Menu.Target>
        <Avatar color="blue" radius="xl" styles={{ root: { cursor: 'pointer' } }}> {userBadge}</Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser size={16} />}
          onClick={() => router.push('/profile')}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};