import { InterviewRoundStatus, InterviewRoundTypes } from "@agent-xenon/constants";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case InterviewRoundStatus.YET_TO_START:
      return 'blue';
    case InterviewRoundStatus.ONGOING:
      return 'yellow';
    case InterviewRoundStatus.COMPLETED:
      return 'teal';
    case InterviewRoundStatus.SELECTED:
      return 'green';
    case InterviewRoundStatus.REJECTED:
      return 'red';
    case InterviewRoundStatus.PAUSED:
      return 'orange';
    default:
      return 'gray';
  }
};

export const getRoundTypeColor = (type: InterviewRoundTypes): string => {
  switch (type) {
    case InterviewRoundTypes.SCREENING:
      return 'blue';
    case InterviewRoundTypes.TECHNICAL:
      return 'green';
    case InterviewRoundTypes.MEETING:
      return 'purple';
    default:
      return 'gray';
  }
};