'use client'
import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect } from "react"
import { useRouter } from 'next/navigation'

export const AuthProvider = ({ children, token }: { token: string, children: ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors(token);
    }
  }, [token])

  if (!token) router.push('/login');

  return children
}