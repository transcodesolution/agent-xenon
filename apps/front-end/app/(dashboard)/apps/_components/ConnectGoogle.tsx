'use client'
import { useConnectApp } from '@/libs/react-query-hooks/src/lib/app/useConnectApp'
import { useDisconnectApp } from '@/libs/react-query-hooks/src/lib/app/useDisconnectApp'
import { IApp } from '@agent-xenon/interfaces'
import { Button, Card, Flex, Group, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import React, { useState } from 'react'

interface IConnectGoogle {
  app: IApp
}

export const ConnectGoogle = ({ app }: IConnectGoogle) => {
  const [connectionStatus, setConnectionStatus] = useState<'isConnecting' | 'isDisconnecting' | 'connected' | 'disconnected'>(app.isAppConnect ? 'connected' : 'disconnected');
  const { mutate: connectApp } = useConnectApp();
  const { mutate: disconnectApp } = useDisconnectApp();

  const handleConnection = () => {
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('isConnecting');
      connectApp({ appId: app._id }, {
        onSuccess: (response) => {
          window.open(response.data?.redirectUrl, '_blank');
        },
        onError: (error) => {
          showNotification({ title: 'Error', message: error?.message || 'Failed to connect' });
          setConnectionStatus('disconnected')
        }
      })
    } else if (connectionStatus === 'connected') {
      setConnectionStatus('isDisconnecting');
      disconnectApp({ appId: app._id }, {
        onSuccess: (response) => {
          showNotification({ message: response.message })
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
