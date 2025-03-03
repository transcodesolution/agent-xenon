import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Notification } from '@/libs/components/custom/notification';
import ApplicantMainLayout from './_components/ApplicantMainLayout';

export const metadata = {
  title: 'Agent Xenon',
  description: 'Agent Xenon is capable of automate organization repeatedly processes',
};

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get('agentXenonApplicantToken')?.value || '';

  if (bearerToken) {
    redirect('/interview')
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
        <MantineProvider>
          <Notification position='bottom-right' />
          <ApplicantMainLayout>
            {children}
          </ApplicantMainLayout>
        </MantineProvider>
      </body>
    </html >
  );
}