import type { School } from '@/types/school';

export enum SchoolFormTypesEnum {
  ADD_SCHOOL_FORM = 'ADD_SCHOOL_FORM',
  REMOVE_SCHOOL_FORM = 'REMOVE_SCHOOL_FORM',
}

export interface UserAction {
  type: SchoolFormTypesEnum;
  payload: School;
}
