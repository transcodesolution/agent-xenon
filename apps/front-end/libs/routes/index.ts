function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_JOB = '/jobs';
const ROOTS_AUTH = '';

export const PATH_JOB = {
  root: ROOTS_JOB,
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signin: path(ROOTS_AUTH, '/signin'),
  signup: path(ROOTS_AUTH, '/signup'),
  passwordReset: path(ROOTS_AUTH, '/password-reset'),
};