import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/tiptap/styles.css';
import '@mantine/code-highlight/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ReactQueryClientProvider } from '@/libs/components/providers/ReactQueryClientProvider';
import MainLayout from './_components/MainLayout';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/libs/components/providers/AuthProvider';
import { Notification } from '@/libs/components/custom/notification';
import { redirect } from 'next/navigation';
import { ModalsProvider } from '@mantine/modals';
import ProgressBar from './_components/ProgressBar';

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
  const bearerToken = cookieStore.get('agentXenonToken')?.value || '';
  if(!bearerToken){
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
        <ProgressBar />
        <ReactQueryClientProvider>
          <AuthProvider token={bearerToken}>
            <MantineProvider>
              <ModalsProvider>
                <Notification position='bottom-right' />
                <MainLayout>{children}</MainLayout>
              </ModalsProvider>
            </MantineProvider>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html >
  );
}