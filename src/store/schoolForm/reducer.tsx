import type { School } from '@/types/school';

import type { UserAction } from './types';
import { SchoolFormTypesEnum } from './types';

export const schoolFormReducer = (_: School, action: UserAction) => {
  switch (action.type) {
    case SchoolFormTypesEnum.ADD_SCHOOL_FORM: {
      const {
        name,
        city,
        state,
        street,
        cep,
        visualIdentity,
        projectId: { value, label },
      } = action.payload;
      return {
        name,
        city,
        state,
        street,
        cep,
        visualIdentity,
        projectId: { value, label },
      };
    }

    case SchoolFormTypesEnum.REMOVE_SCHOOL_FORM: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
