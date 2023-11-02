import type { SocialEducator } from '@/types/socialEducator';

import {
  type SocialEducatorFormAction,
  SocialEducatorFormTypesEnum,
} from './types';

export const socialEducatorFormReducer = (
  _: SocialEducator,
  action: SocialEducatorFormAction,
) => {
  switch (action.type) {
    case SocialEducatorFormTypesEnum.ADD_SOCIAL_EDUCATOR_FORM: {
      const {
        name,
        email,
        period,
        schoolId,
        year,
        visualIdentity,
        telephone,
        password,
      } = action.payload;
      return {
        name,
        email,
        period,
        schoolId,
        year,
        visualIdentity,
        telephone,
        password,
      };
    }
    case SocialEducatorFormTypesEnum.REMOVE_SOCIAL_EDUCATOR_FORM: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
