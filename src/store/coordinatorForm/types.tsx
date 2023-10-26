import type { Coordinator } from '@/types/coordinator';

export enum CoordinatorFormTypesEnum {
  ADD_COORDINATOR_FORM = 'ADD_COORDINATOR_FORM',
  REMOVE_COORDINATOR_FORM = 'REMOVE_COORDINATOR_FORM',
}

export interface CoordinatorAction {
  type: CoordinatorFormTypesEnum;
  payload: Coordinator | any;
}
