"use client";

import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './_components/MainLayout';
import { setupAxiosInterceptors } from '@agent-xenon/web-apis';

// export const metadata = {
//   title: 'My Mantine app',
//   description: 'I have followed setup instructions carefully',
// };

// Create a client

setupAxiosInterceptors()
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <MainLayout>{children}</MainLayout>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}