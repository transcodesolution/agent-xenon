import { TopicSectionType } from "@agent-xenon/constants";
import { IInterviewQuestionAnswer } from "./interview-question";

export interface ITraining {
  title: string;  //react training
  description: string;
  topics: ITopic[];
}

export interface ITopic {
  title: string; //state in react
  description: string;
  topicSections: ITopicSection[],
  childTopics: ITopic[]
}

export interface ITopicSection {
  name: string;
  type: TopicSectionType;
  topicSectionConfig: ITopicSectionConfig;
}

export interface ITopicSectionConfig {
  [TopicSectionType.AUDIO]?: {
    audioTitle: string;
    audioDescription: string;
    audioURL: string;
  };
  [TopicSectionType.VIDEO]?: {
    videoTitle: string;
    videoDescription?: string;
    videoURL: string;
  };
  [TopicSectionType.TEXT]?: {
    text: string;
  };
  [TopicSectionType.PRACTICAL]?: {
    questions: IInterviewQuestionAnswer[]
  };
  [TopicSectionType.ASSISTANT]?: {
    prompt: string
  };
}
