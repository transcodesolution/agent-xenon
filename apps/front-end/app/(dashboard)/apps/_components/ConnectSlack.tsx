'use client'
import { IApp } from '@agent-xenon/interfaces'
import { Button, Card, Flex, Group, Stack, Text } from '@mantine/core'
import { IconBrandSlack } from '@tabler/icons-react'
import React, { useState } from 'react'

interface IConnectSlack {
  app: IApp
}

export const ConnectSlack = ({ app }: IConnectSlack) => {
  const [connectionStatus] = useState<'isConnecting' | 'isDisconnecting' | 'connected' | 'disconnected'>(app.isAppConnect ? 'connected' : 'disconnected');

  const handleConnection = () => {
    console.log('connecting')
  }

  const isLoading = connectionStatus === 'isConnecting' || connectionStatus === 'isDisconnecting'
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap='sm' align='center'>
        <Stack>
          <Group>
            <IconBrandSlack color='green' />
            <Text fw='bold'>Slack</Text>
          </Group>
          <Text size='xs'>Connect Your Organization&apos;s Slack APP For Notifications</Text>
        </Stack>
        <Button onClick={handleConnection} disabled={isLoading} loading={isLoading} style={{ width: '30%' }}>{connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}</Button>
      </Flex>
    </Card>
  )
}
