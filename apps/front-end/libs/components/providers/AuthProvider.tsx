'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react";
import { Permission } from "@agent-xenon/constants";
import { setPermissions } from "@/libs/store/src";
import { useGetUser } from "@agent-xenon/react-query-hooks";
import { setUser } from "@/app/(dashboard)/store/useUserStore";
import { setOrganization } from "@/app/(dashboard)/store/useOrganizationStore";

export const AuthProvider = ({
  children,
  token,
  permissions,
}: {
  token: string;
  children: ReactNode;
  permissions?: Permission[];
}) => {
  const { data } = useGetUser({});

  useEffect(() => {
    setupAxiosInterceptors({ token });
  }, [token]);

  useEffect(() => {
    if (permissions) {
      setPermissions(permissions);
    }
  }, [permissions]);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.userData);
      setOrganization(data.data.organizationData);
    }
  }, [data]);

  return <>{children}</>;
};
