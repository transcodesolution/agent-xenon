'use client';

import {
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
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
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token');
  const router = useRouter();

  const form = useForm({
    initialValues: { email: '', password: '' },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value && value?.length < 8
          ? 'Password must include at least 8 characters'
          : null,
    },
  });

  const handleSignInFormSubmit = form.onSubmit(async ({ email, password }) => {
    try {
      const previousURL = document.referrer;
      const redirectUrl = token ? new URL(previousURL).pathname : "/";

      await nextServerSignIn({
        email,
        password,
        name: 'transcodezy',
        candidateToken: token || '',
      });
      router.push(redirectUrl)
    } catch (error: any) {
      showNotification({
        message: error?.message
      })
    }
  })

  return (
    <>
      <title>Sign in | Agent Xenon</title>
      <meta
        name="description"
        content="Your Daily Work Partner | Now Do Less and Delegate More"
      />
      <Center h='100vh'>
        <Box>
          <Title ta="center">Welcome back!</Title>
          <Text ta="center">Sign in to your account to continue</Text>

          <Surface component={Paper} className={classes.card}>
            <form
              onSubmit={handleSignInFormSubmit}
            >
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
              <Button fullWidth mt="xl" type="submit">
                Sign in
              </Button>
            </form>
          </Surface>
        </Box>
      </Center>
    </>
  );
}