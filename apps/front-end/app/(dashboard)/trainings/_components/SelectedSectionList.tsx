import React from 'react'
import { Stack } from '@mantine/core';
import { VideoSection } from './VideoSection';
import { AudioSection } from './AudioSection';
import Surface from '@/libs/components/custom/surface';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';
import { TextSection } from './TextSection';
import { PracticalSection } from './PracticalSection';
import { AssistantSection } from './AssistantSection';

interface ISelectedSectionList {
  sections: ITopicSection[];
}
export const SelectedSectionList = ({ sections }: ISelectedSectionList) => {
  const renderSection = (section: ITopicSection) => {
    switch (section.type) {
      case TopicSectionType.VIDEO:
        return <VideoSection section={section} />
      case TopicSectionType.AUDIO:
        return <AudioSection />
      case TopicSectionType.TEXT:
        return <TextSection />
      case TopicSectionType.PRACTICAL:
        return <PracticalSection />
      case TopicSectionType.ASSISTANT:
        return <AssistantSection />
      default:
        return null;
    }
  }
  return (
    <Stack>
      {sections.map((section, index) => <Surface style={{ border: '1px solid black' }} h={40} w='100%'>
        {renderSection(section)}
      </Surface>
      )}
    </Stack>
  )
}
