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
import { useRouter } from 'next/navigation';
import Surface from '@/libs/components/custom/surface';
import { PATH_AUTH } from '@/libs/routes';
import classes from './signin.module.scss';
import { signIn } from '@/libs/web-apis/src';

export default function Page() {
  const { push } = useRouter();
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
              onSubmit={form.onSubmit(async ({ email, password }) => {
                const result = await signIn({ email, password })
                if (result.message) {
                  push('/jobs')
                }
              })}
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