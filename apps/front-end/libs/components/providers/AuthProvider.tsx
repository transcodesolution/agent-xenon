'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react";
import { setPermissions } from "@/libs/store/src";
import { useGetUser } from "@agent-xenon/react-query-hooks";
import { setUser } from "@/libs/store/src/lib/user";
import { setOrganization } from "@/libs/store/src/lib/organization";

export const AuthProvider = ({
  children,
  token,
}: {
  token: string;
  children: ReactNode;
}) => {
  //the reason why i am not putting below function in useEffect is because of the order of execution of the function is necessary. it need to call out first somehow before any other http request has been made
  setupAxiosInterceptors({ token })

  const { data } = useGetUser({ enabled: !!token });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.userData);
      setOrganization(data.data.organizationData);
      setPermissions(data?.data?.userData?.role?.permissions)
    }
  }, [data]);

  return children;
};
