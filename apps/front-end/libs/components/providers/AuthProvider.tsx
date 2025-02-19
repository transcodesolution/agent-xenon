'use client'
import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Permission } from "@agent-xenon/constants";
import { setPermissions } from "@/libs/store/src";

export const AuthProvider = ({ children, token, permissions }: { token: string, children: ReactNode, permissions: Permission[] }) => {
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors(token);
    }
    if (permissions && permissions.length) {
      setPermissions(permissions)
    }
  }, [token, permissions])

  if (!token) router.push('/login');

  return children
}