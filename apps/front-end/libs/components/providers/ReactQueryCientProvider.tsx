'use client'
import { setupAxiosInterceptors } from '@agent-xenon/web-apis';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

interface IReactQueryClientProvider {
  children: React.ReactNode
}

setupAxiosInterceptors()

export const ReactQueryClientProvider = ({ children }: IReactQueryClientProvider) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
