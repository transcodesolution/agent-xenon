import { TopicSectionType, TrainingLevel } from "@agent-xenon/constants";
import { IInterviewQuestion } from "./interview-question";
import { ITimestamp } from "./timestamp";
import { IEmployee } from "./employee";

export interface ITraining extends ITimestamp {
  title: string;  //react training
  description: string;
  topics: ITopic[];
  topicIds: string[];
  organizationId: string;
  tags: string[];
  level: TrainingLevel;
  assignees: IAssignedTraining[];
}

export interface IAssignedTraining extends ITimestamp {
  employeeId: string;
  employee: IEmployee;
  startDate: Date;
  endDate: Date;
  progress: number;
  trainingId: string;
  submittedAnswers: ISubmittedAnswer[];
}

export interface ISubmittedAnswer {
  answer: string;
  questionId: string;
  sectionId: string;
}

export interface ITopic extends ITimestamp {
  _id: string;
  title: string; //state in react
  description: string;
  topicSections: ITopicSection[];
  childTopics: ITopic[];
  parentTopicId: string;
  trainingId: string;
}

export interface ITopicSection {
  _id: string;
  name: string;
  content: string;
  type: TopicSectionType;
  order: number;
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
    questions: { question: IInterviewQuestion, questionId: string }[]
  };
  [TopicSectionType.ASSISTANT]?: {
    prompt: string
  };
}