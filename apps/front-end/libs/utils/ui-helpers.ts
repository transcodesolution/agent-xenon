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
    case InterviewRoundTypes.ASSESSMENT:
      return 'green';
    case InterviewRoundTypes.MEETING:
      return 'purple';
    default:
      return 'gray';
  }
};

export const isEquals = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || !obj1 || !obj2) return false;

  const keys1 = Object.keys(obj1 as object);
  const keys2 = Object.keys(obj2 as object);

  if (keys1.length !== keys2.length) return false;

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  return keys1.every((key) => isEquals((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key]));
};


