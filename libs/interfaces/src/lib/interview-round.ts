import { InterviewRoundStatus, InterviewRoundTypes, TechnicalRoundTypes } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IInterviewRounds<T = string> extends ITimestamp {
    _id: string;
    type: InterviewRoundTypes;
    subType: TechnicalRoundTypes;
    durationInSeconds: number;
    qualificationCriteria: string;
    mcqCriteria: number;
    jobId: T;
    startDate: Date;
    endDate: Date;
    roundNumber: number;
    status: InterviewRoundStatus;
    _doc: IInterviewRounds<T>;
    previousRound?: Partial<IInterviewRounds<T>>;
}