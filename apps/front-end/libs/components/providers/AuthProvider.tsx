'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Permission } from "@agent-xenon/constants";
import { setPermissions } from "@/libs/store/src";

export const AuthProvider = ({
  children,
  token,
  permissions,
}: {
  token: string;
  children: ReactNode;
  permissions?: Permission[];
}) => {
  const router = useRouter();

  useEffect(() => {
    setupAxiosInterceptors(token, (redirectUrl) => router.push(redirectUrl));
    if (permissions && permissions.length) {
      setPermissions(permissions);
    }
    // if (!token) {
    //   router.push('/signin');
    // }
  }, [token, permissions, router]);

  return <>{children}</>;
};
