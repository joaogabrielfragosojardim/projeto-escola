import type { SocialEducator } from '@/types/socialEducator';

export enum SocialEducatorFormTypesEnum {
  ADD_SOCIAL_EDUCATOR_FORM = 'ADD_SOCIAL_EDUCATOR_FORM',
  REMOVE_SOCIAL_EDUCATOR_FORM = 'REMOVE_SOCIAL_EDUCATOR_FORM',
}

export interface SocialEducatorFormAction {
  type: SocialEducatorFormTypesEnum;
  payload: SocialEducator | any;
}
