import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import MainLayout from './_components/MainLayout';
import { ReactQueryClientProvider } from '@/libs/components/providers/ReactQueryCientProvider';

export const metadata = {
  title: 'Agent Xenon',
  description: 'Agent Xenon is capable of automate organization repeatedly processes',
};


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
        <ReactQueryClientProvider>
          <MantineProvider>
            <MainLayout>{children}</MainLayout>
          </MantineProvider>
      </ReactQueryClientProvider>
    </body>
    </html >
  );
}