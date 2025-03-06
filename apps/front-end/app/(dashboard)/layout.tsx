import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ReactQueryClientProvider } from '@/libs/components/providers/ReactQueryClientProvider';
import MainLayout from './_components/MainLayout';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/libs/components/providers/AuthProvider';
import { getPermissions } from '@/libs/web-apis/src/lib/permission';

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
              <MainLayout>{children}</MainLayout>
            </MantineProvider>
          </ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html >
  );
}