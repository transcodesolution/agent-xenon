export enum Permission {
  JOB_CREATE = 'job_create',
  JOB_READ = 'job_read',
  JOB_UPDATE = 'job_update',
  JOB_DELETE = 'job_delete',
  ROLE_CREATE = 'role_create',
  ROLE_READ = 'role_read',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',
  EXAM_PAGE = 'exam_page',
  ORGANIZATION_UPDATE = 'organization_update',
  JOB_ROLE_CREATE = 'job_role_create',
  JOB_ROLE_READ = 'job_role_read',
  JOB_ROLE_UPDATE = 'job_role_update',
  JOB_ROLE_DELETE = 'job_role_delete',
  DESIGNATION_CREATE = 'designation_create',
  DESIGNATION_READ = 'designation_read',
  DESIGNATION_UPDATE = 'designation_update',
  DESIGNATION_DELETE = 'designation_delete',
  QUESTION_ANSWER_CREATE = 'question_answer_create',
  QUESTION_ANSWER_READ = 'question_answer_read',
  QUESTION_ANSWER_UPDATE = 'question_answer_update',
  QUESTION_ANSWER_DELETE = 'question_answer_delete',
  APPLICANT_READ = 'applicant_read',
  JOB_CANDIDATES_TAB = 'job_candidates_tab',
  JOB_ROUNDS_TAB = 'job_rounds_tab',
  ROUND_ORDER_UPDATE = 'round_order_update',
  INTERVIEW_ROUND_CREATE = 'interview_round_create',
  INTERVIEW_ROUND_UPDATE = 'interview_round_update',
  INTERVIEW_ROUND_DELETE = 'interview_round_delete',
}

export const permissionsListByModuleWise: Record<string, { label: string, value: Permission }[]> = {
  job: [
    {
      label: 'Create',
      value: Permission.JOB_CREATE
    },
    {
      label: 'Read',
      value: Permission.JOB_READ
    },
    {
      label: 'Update',
      value: Permission.JOB_UPDATE
    },
    {
      label: 'Delete',
      value: Permission.JOB_DELETE
    }
  ],
  role: [
    {
      label: 'Create',
      value: Permission.ROLE_CREATE
    },
    {
      label: 'Read',
      value: Permission.ROLE_READ
    },
    {
      label: 'Update',
      value: Permission.ROLE_UPDATE
    },
    {
      label: 'Delete',
      value: Permission.ROLE_DELETE
    }
  ],
}