import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import MainLayout from './_components/MainLayout';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
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
        <MantineProvider><MainLayout>{children}</MainLayout></MantineProvider>
      </body>
    </html>
  );
}