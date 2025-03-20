'use client'
import { Button, Card, Flex, Group, Stack, Text } from '@mantine/core'
import { IconBrandSlack } from '@tabler/icons-react'
import React, { useState } from 'react'

export const ConnectSlack = () => {
  const [connectionStatus, setConnectionStatus] = useState<'isConnecting' | 'connected' | 'disconnect'>('disconnect');

  const handleConnect = () => {
    setConnectionStatus('isConnecting');
    //write the logic to connect
    setConnectionStatus('connected');

  }
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap='sm' align='center'>
        <Stack>
          <Group>
            <IconBrandSlack color='green' />
            <Text fw='bold'>Slack</Text>
          </Group>
          <Text size='xs'>Connect Your Organization&apos;s Slack APP to Allow Slack Notifications</Text>
        </Stack>
        <Button onClick={handleConnect} disabled={connectionStatus === 'isConnecting'} loading={connectionStatus === 'isConnecting'} style={{ width: '30%' }}>Connect</Button>
      </Flex>
    </Card>
  )
}
