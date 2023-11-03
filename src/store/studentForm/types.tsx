import type { Student } from '@/types/student';

export enum StudentFormTypesEnum {
  ADD_STUDENT_FORM = 'ADD_STUDENT_FORM',
  REMOVE_STUDENT_FORM = 'REMOVE_STUDENT_FORM',
}

export interface StudentFormAction {
  type: StudentFormTypesEnum;
  payload: Student | any;
}
