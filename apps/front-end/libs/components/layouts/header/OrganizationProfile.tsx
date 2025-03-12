import { IOrganization } from '@agent-xenon/interfaces'
import { Text, Menu, Flex } from '@mantine/core'
import { IconBuildings, IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'

interface IOrganizationProfile {
  organization: IOrganization
}

export const OrganizationProfile = ({ organization }: IOrganizationProfile) => {
  const [opened, setOpened] = useState(false);
  return (
    <Menu position='bottom' offset={2} width={300} opened={opened} onChange={setOpened}>
      <Menu.Target>
        <Flex align='center' justify='space-between' px='xs'>
          <Text size="lg" fw={600} lineClamp={1} styles={{ root: { cursor: 'pointer' } }}>{organization?.name}</Text>
          {opened ? <IconChevronDown stroke={1.5} size={16} /> : <IconChevronRight stroke={1.5} size={16} />}
        </Flex>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href='/organization'
          leftSection={<IconBuildings size={16} />}
        >
          Detail
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}