'use client'
import { useGetConnectApp } from '@/libs/react-query-hooks/src/lib/app/useGetConnectApp'
import { useGetDisconnectApp } from '@/libs/react-query-hooks/src/lib/app/useGetDisconnectApp'
import { Button, Card, Flex, Group, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import React, { useState } from 'react'

export const ConnectGoogle = () => {
  const [connectionStatus, setConnectionStatus] = useState<'isConnecting' | 'isDisconnecting' | 'connected' | 'disconnected'>('disconnected');
  const { mutate: connectApp } = useGetConnectApp();
  const { mutate: disconnectApp } = useGetDisconnectApp();

  const handleConnection = () => {
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('isConnecting');
      connectApp('_id', {
        onSuccess: (response) => {
          window.open(response.data, '_blank');
        },
        onError: (error) => {
          showNotification({ title: 'Error', message: error?.message || 'Failed to connect' });
          setConnectionStatus('disconnected')
        }
      })
    } else if (connectionStatus === 'connected') {
      setConnectionStatus('isDisconnecting');
      disconnectApp('_id', {
        onSuccess: (response) => {
          window.open(response.data, '_blank');
        },
        onError: (error) => {
          showNotification({ title: 'Error', message: error?.message || 'Failed to disconnect' });
          setConnectionStatus('connected')
        },
        onSettled: () => {
          setConnectionStatus('disconnected')
        }
      })
    }
  }

  const isLoading = connectionStatus === 'isConnecting' || connectionStatus === 'isDisconnecting'
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap='sm' align='center'>
        <Stack>
          <Group>
            <IconBrandGoogleFilled color='red' />
            <Text fw='bold'>Google</Text>
          </Group>
          <Text size='xs'>Connect Your Organization&apos;s Google APP to Allow Schedule Meeting</Text>
        </Stack>
        <Button onClick={handleConnection} disabled={isLoading} loading={isLoading} style={{ width: '30%' }}>{connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}</Button>
      </Flex>
    </Card>
  )
}
