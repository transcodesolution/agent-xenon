import { ITopicSection } from '@agent-xenon/interfaces'
import React from 'react'

interface IVideoSection {
  section: ITopicSection
}
export const VideoSection = ({ section }: IVideoSection) => {

  return (
    <div>{section.name}</div>
  )
}