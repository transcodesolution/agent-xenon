import { Flex, Stack } from '@mantine/core'
import React from 'react'
import { IconBrandYoutube, IconDeviceAudioTape, IconRobot, IconTestPipe, IconTextCaption } from '@tabler/icons-react'
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';

interface ISectionList {
  onSelectSection: (section: ITopicSection) => void;
}

export const SectionList = ({ onSelectSection }: ISectionList) => {
  const sectionList: { label: string; type: TopicSectionType, icon: React.ReactNode }[] = [
    {
      type: TopicSectionType.VIDEO,
      label: 'Add Video Section',
      icon: <IconBrandYoutube size={24} />
    },
    {
      type: TopicSectionType.AUDIO,
      label: 'Add Audio Section',
      icon: <IconDeviceAudioTape size={24} />
    },
    {
      type: TopicSectionType.TEXT,
      label: 'Add Text Section',
      icon: <IconTextCaption size={24} />
    },
    {
      type: TopicSectionType.PRACTICAL,
      label: 'Add Practical Section',
      icon: <IconTestPipe size={24} />
    },
    {
      type: TopicSectionType.ASSISTANT,
      label: 'Add Assistant Section',
      icon: <IconRobot size={24} />
    },
  ]

  const handleAddSection = (sectionType: TopicSectionType) => {
    let section: ITopicSection | null = null;
    switch (sectionType) {
      case TopicSectionType.VIDEO:
        section = {
          name: 'Video',
          type: TopicSectionType.VIDEO,
          topicSectionConfig: {
            [TopicSectionType.VIDEO]: {
              videoTitle: '',
              videoDescription: '',
              videoURL: ''
            }
          }
        }
        break;
      case TopicSectionType.AUDIO:
        section = {
          name: 'Audio',
          type: TopicSectionType.AUDIO,
          topicSectionConfig: {
            [TopicSectionType.AUDIO]: {
              audioTitle: '',
              audioDescription: '',
              audioURL: ''
            }
          }
        }
        break;
      case TopicSectionType.TEXT:
        section = {
          name: 'Text',
          type: TopicSectionType.TEXT,
          topicSectionConfig: {
            [TopicSectionType.TEXT]: {
              text: ''
            }
          }
        }
        break;
      case TopicSectionType.PRACTICAL:
        section = {
          name: 'Practical',
          type: TopicSectionType.PRACTICAL,
          topicSectionConfig: {
            [TopicSectionType.PRACTICAL]: {
              questions: []
            }
          }
        }
        break;
      case TopicSectionType.ASSISTANT:
        section = {
          name: 'Assistant',
          type: TopicSectionType.ASSISTANT,
          topicSectionConfig: {
            [TopicSectionType.ASSISTANT]: {
              prompt: ''
            }
          }
        }
        break;

      default:
        break;
    }
    if (!section) return null;

    onSelectSection(section)
  }

  return (
    <Stack gap='xs'>
      {
        sectionList.map((section) =>
          <Flex align='center' gap='xs' bg='white' onClick={() => handleAddSection(section.type)}>
            {section.icon}
            {section.label}
          </Flex>
        )
      }
    </Stack>
  )
}