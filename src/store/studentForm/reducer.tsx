import type { SocialEducator } from '@/types/socialEducator';

import type { StudentFormAction } from './types';
import { StudentFormTypesEnum } from './types';

export const studentFormReducer = (
  _: SocialEducator,
  action: StudentFormAction,
) => {
  switch (action.type) {
    case StudentFormTypesEnum.ADD_STUDENT_FORM: {
      const {
        visualIdentity,
        name,
        email,
        schoolId,
        classId,
        password,
        birtday,
      } = action.payload;
      return {
        name,
        email,
        classId,
        schoolId,
        birtday,
        visualIdentity,
        password,
      };
    }
    case StudentFormTypesEnum.REMOVE_STUDENT_FORM: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
