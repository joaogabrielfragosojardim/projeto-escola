export type Role =
  | 'master'
  | 'administrator'
  | 'coordinator'
  | 'teacher'
  | 'student';

export enum RoleEnum {
  COORDINATOR = 'coordinator',
  STUDENT = 'student',
  ADM_MASTER = 'master',
  ADM = 'administrator',
  TEACHER = 'teacher',
}
