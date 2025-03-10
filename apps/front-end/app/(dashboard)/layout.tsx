import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ReactQueryClientProvider } from '@/libs/components/providers/ReactQueryClientProvider';
import MainLayout from './_components/MainLayout';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/libs/components/providers/AuthProvider';
import { getPermissions } from '@/libs/web-apis/src/lib/permission';
import { Notification } from '@/libs/components/custom/notification';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Agent Xenon',
  description: 'Agent Xenon is capable of automate organization repeatedly processes',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const permissions = await getPermissions();
  const bearerToken = cookieStore.get('agentXenonToken')?.value || '';

  if (!bearerToken) {
    redirect('/signin')
  }
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <AuthProvider token={bearerToken} permissions={permissions.data.permissions}>
          <ReactQueryClientProvider>
            <MantineProvider>
              <Notification position='bottom-right' />
              <MainLayout>{children}</MainLayout>
            </MantineProvider>
          </ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html >
  );
}