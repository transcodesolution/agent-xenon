'use client';

import {
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import Surface from '@/libs/components/custom/surface';
import { PATH_AUTH } from '@/libs/routes';
import classes from './signin.module.scss';
import { nextServerSignIn } from '@/libs/web-apis/src';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { getOrganizationName } from '@/libs/utils/getConfig';
import { UserType } from '@agent-xenon/constants';

const ROLE_OPTIONS = [
  { value: UserType.APPLICANT, label: 'Applicant' },
  { value: UserType.MEMBER, label: 'Member' },
  { value: UserType.EMPLOYEE, label: 'Employee' }
];

export const SignInForm = () => {
  const router = useRouter();
  const organizationName = getOrganizationName();

  const form = useForm({
    initialValues: { email: '', password: '', role: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value?.length < 8 ? 'Password must include at least 8 characters' : null,
      role: (value) => (value ? null : 'Please select a role'),
    },
  });

  const handleSignInFormSubmit = form.onSubmit(async ({ email, password, role }) => {
    try {
      const previousURL = document.referrer;
      await nextServerSignIn({
        email,
        password,
        name: organizationName,
        userType: role as UserType,
      });

      const redirectMap: Record<string, string> = {
        applicant: new URL(previousURL).pathname,
        user: '/dashboard',
        employee: '/employee/dashboard',
      };

      router.push(redirectMap[role] || '/');
    } catch (error: any) {
      showNotification({
        message: error?.message || 'Login failed',
        color: 'red',
      });
    }
  });

  return (
    <>
      <title>Sign in | Agent Xenon</title>
      <meta name="description" content="Your Daily Work Partner | Now Do Less and Delegate More" />
      <Center h="100vh">
        <Box>
          <Title ta="center">Welcome back!</Title>
          <Text ta="center">Sign in to your account to continue</Text>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={handleSignInFormSubmit} onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignInFormSubmit();
              }
            }}>
              <Select
                label="Select Role"
                placeholder="Choose your role"
                data={ROLE_OPTIONS}
                required
                {...form.getInputProps('role')}
                mb="md"
              />
              <TextInput
                label="Email"
                placeholder="you@agentxenon.com"
                required
                classNames={{ label: classes.label }}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                classNames={{ label: classes.label }}
                {...form.getInputProps('password')}
              />
              <Group justify="space-between" mt="lg">
                <Checkbox
                  label="Remember me"
                  classNames={{ label: classes.label }}
                />
                <Text
                  component={Link}
                  href={PATH_AUTH.passwordReset}
                  size="sm"
                  className={classes.link}
                >
                  Forgot password?
                </Text>
              </Group>
              <Button fullWidth mt="xl" type="submit" loading={form.submitting} disabled={form.submitting}>
                Sign in
              </Button>
            </form>
          </Surface>
        </Box>
      </Center>
    </>
  );
};
