import { Permission } from "@agent-xenon/constants";

export const PERMISSIONS: { [key: string]: Permission[] } = {
  hasJobCreate: [Permission.JOB_CREATE],
  hasJobRead: [Permission.JOB_READ],
  hasJobUpdate: [Permission.JOB_UPDATE],
  hasJobDelete: [Permission.JOB_DELETE],

  hasInterviewRoundCreate: [Permission.INTERVIEW_ROUND_CREATE],
  hasInterviewRoundUpdate: [Permission.INTERVIEW_ROUND_UPDATE],
  hasInterviewRoundDelete: [Permission.INTERVIEW_ROUND_DELETE],

  hasJobRoleCreate: [Permission.JOB_ROLE_CREATE],
  hasJobRoleRead: [Permission.JOB_ROLE_READ],
  hasJobRoleUpdate: [Permission.JOB_ROLE_UPDATE],
  hasJobRoleDelete: [Permission.JOB_ROLE_DELETE],

  hasDesignationCreate: [Permission.DESIGNATION_CREATE],
  hasDesignationRead: [Permission.DESIGNATION_READ],
  hasDesignationUpdate: [Permission.DESIGNATION_UPDATE],
  hasDesignationDelete: [Permission.DESIGNATION_DELETE],

  hasApplicantRead: [Permission.APPLICANT_READ],
  hasJobCandidatesTab: [Permission.JOB_CANDIDATES_TAB],
  hasJobRoundsTab: [Permission.JOB_ROUNDS_TAB],
  hasRoundOrderUpdate: [Permission.ROUND_ORDER_UPDATE],

  hasRoleCreate: [Permission.ROLE_CREATE],
  hasRoleRead: [Permission.ROLE_READ],
  hasRoleUpdate: [Permission.ROLE_UPDATE],
  hasRoleDelete: [Permission.ROLE_DELETE],

  hasExamPageAccess: [Permission.EXAM_PAGE],
  hasOrganizationUpdate: [Permission.ORGANIZATION_UPDATE],

  hasQuestionAnswerCreate: [Permission.QUESTION_ANSWER_CREATE],
  hasQuestionAnswerRead: [Permission.QUESTION_ANSWER_READ],
  hasQuestionAnswerUpdate: [Permission.QUESTION_ANSWER_UPDATE],
  hasQuestionAnswerDelete: [Permission.QUESTION_ANSWER_DELETE],
};
