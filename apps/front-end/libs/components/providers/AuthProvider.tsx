'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react";
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

  useEffect(() => {
    setupAxiosInterceptors({ token });
  }, [token]);

  useEffect(() => {
    if (permissions) {
      setPermissions(permissions);
    }
  }, [permissions])


  return <>{children}</>;
};
