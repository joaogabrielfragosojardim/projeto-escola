import type { User } from '@/types/user';

export enum UserTypesEnum {
  ADD_USER = 'ADD_USER',
  REMOVE_USER = 'REMOVE_USER',
}

export interface UserAction {
  type: UserTypesEnum;
  payload: User;
}
