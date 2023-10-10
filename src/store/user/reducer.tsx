import type { User } from '@/types/user';

import { UserTypesEnum } from './types';

interface UserAction extends User {
  type: UserTypesEnum;
}

export const userReducer = (_: any, action: UserAction) => {
  switch (action.type) {
    case UserTypesEnum.ADD_USER: {
      const { name, email } = action;
      return { name, email };
    }
    case UserTypesEnum.REMOVE_USER: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
