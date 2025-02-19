'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

interface IReactQueryClientProvider {
  children: React.ReactNode
}

export const ReactQueryClientProvider = ({ children }: IReactQueryClientProvider) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}