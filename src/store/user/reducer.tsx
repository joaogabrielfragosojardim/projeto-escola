import type { User } from '@/types/user';

import type { UserAction } from './types';
import { UserTypesEnum } from './types';

export const userReducer = (_: User, action: UserAction) => {
  switch (action.type) {
    case UserTypesEnum.ADD_USER: {
      const { id, name, email, role } = action.payload;
      return { id, name, email, role };
    }
    case UserTypesEnum.REMOVE_USER: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
