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
  CONNECT_APP = 'connect_app',
  DISCONNECT_APP = 'disconnect_app',
  READ_APP_INFO = 'read_app_info',
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_READ = 'user_read',
  USER_DELETE = 'user_delete',
}

export const permissionsListByModuleWise: Record<string, { label: string, permissions: { label: string, value: Permission }[] }> = {
  jobs: {
    label: "Jobs Management",
    permissions: [
      { label: "Create Jobs", value: Permission.JOB_CREATE },
      { label: "View Jobs", value: Permission.JOB_READ },
      { label: "Edit Jobs", value: Permission.JOB_UPDATE },
      { label: "Delete Jobs", value: Permission.JOB_DELETE },
    ]
  },
  roles: {
    label: "Roles Management",
    permissions: [
      { label: "Create Roles", value: Permission.ROLE_CREATE },
      { label: "View Roles", value: Permission.ROLE_READ },
      { label: "Edit Roles", value: Permission.ROLE_UPDATE },
      { label: "Delete Roles", value: Permission.ROLE_DELETE },
    ]
  },
  jobRoles: {
    label: "Job Roles",
    permissions: [
      { label: "Create Job Roles", value: Permission.JOB_ROLE_CREATE },
      { label: "View Job Roles", value: Permission.JOB_ROLE_READ },
      { label: "Edit Job Roles", value: Permission.JOB_ROLE_UPDATE },
      { label: "Delete Job Roles", value: Permission.JOB_ROLE_DELETE },
    ]
  },
  designations: {
    label: "Designations",
    permissions: [
      { label: "Create Designations", value: Permission.DESIGNATION_CREATE },
      { label: "View Designations", value: Permission.DESIGNATION_READ },
      { label: "Edit Designations", value: Permission.DESIGNATION_UPDATE },
      { label: "Delete Designations", value: Permission.DESIGNATION_DELETE },
    ]
  },
  questionAnswers: {
    label: "Questions & Answers",
    permissions: [
      { label: "Create Q&A", value: Permission.QUESTION_ANSWER_CREATE },
      { label: "View Q&A", value: Permission.QUESTION_ANSWER_READ },
      { label: "Edit Q&A", value: Permission.QUESTION_ANSWER_UPDATE },
      { label: "Delete Q&A", value: Permission.QUESTION_ANSWER_DELETE },
    ]
  },
  interviews: {
    label: "Interview Rounds",
    permissions: [
      { label: "Create Rounds", value: Permission.INTERVIEW_ROUND_CREATE },
      { label: "Edit Rounds", value: Permission.INTERVIEW_ROUND_UPDATE },
      { label: "Delete Rounds", value: Permission.INTERVIEW_ROUND_DELETE },
      { label: "Update Round Order", value: Permission.ROUND_ORDER_UPDATE },
    ]
  },
  other: {
    label: "Other Permissions",
    permissions: [
      { label: "View Applicants", value: Permission.APPLICANT_READ },
      { label: "Access Exam Page", value: Permission.EXAM_PAGE },
      { label: "Update Organization", value: Permission.ORGANIZATION_UPDATE },
      { label: "View Job Candidates", value: Permission.JOB_CANDIDATES_TAB },
      { label: "View Job Rounds", value: Permission.JOB_ROUNDS_TAB },
    ]
  }
};