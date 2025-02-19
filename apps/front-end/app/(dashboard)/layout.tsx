import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ReactQueryClientProvider } from '@/libs/components/providers/ReactQueryCientProvider';
import MainLayout from './_components/MainLayout';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/libs/components/providers/AuthProvider';

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
  const bearerToken = cookieStore.get('token')?.value || '';

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
        <AuthProvider token={bearerToken}>
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