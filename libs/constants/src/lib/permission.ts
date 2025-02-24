export enum Permission {
  JOB_CREATE = 'job_create',
  JOB_READ = 'job_read',
  JOB_UPDATE = 'job_update',
  JOB_DELETE = 'job_delete',
  ROLE_CREATE = 'role_create',
  ROLE_READ = 'role_read',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',
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