'use client'
import { Box, Flex } from '@mantine/core'
import React, { useState } from 'react'
import { SelectedSectionList } from '../../_components/SelectedSectionList'
import { SectionList } from '../../_components/SectionList'
import { ITopicSection } from '@agent-xenon/interfaces';

export default function page() {

  const [sections, setSections] = useState<ITopicSection[]>([]);


  const handleSelectSection = (section: ITopicSection) => {
    setSections([...sections, section])
  };

  return (
    <Box>
      <Flex>
        <Box w='70%'>
          <SelectedSectionList sections={sections} />
        </Box>
        <Box w='30%'>
          <SectionList onSelectSection={handleSelectSection} />
        </Box>
      </Flex>
    </Box>

  )
}
