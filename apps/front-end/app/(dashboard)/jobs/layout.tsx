import { Permission } from "@agent-xenon/constants";
import { ProtectedLayoutWrapper } from "../_components/ProtectedLayoutWrapper";

export const metadata = {
  title: 'Agent Xenon',
  description: 'Agent Xenon is capable of automate organization repeatedly processes',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allowPermissions = [Permission.JOB_READ , Permission.JOB_CREATE];
  return (
    <ProtectedLayoutWrapper permissions={allowPermissions}>
      {children}
    </ProtectedLayoutWrapper>
  );
}