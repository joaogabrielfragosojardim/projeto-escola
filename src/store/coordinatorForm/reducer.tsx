import type { Coordinator } from '@/types/coordinator';

import type { CoordinatorAction } from './types';
import { CoordinatorFormTypesEnum } from './types';

export const coordinatorFormReducer = (
  _: Coordinator,
  action: CoordinatorAction,
) => {
  switch (action.type) {
    case CoordinatorFormTypesEnum.ADD_COORDINATOR_FORM: {
      const { name, visualIdentity, email, password, phone, school } =
        action.payload;
      return { name, visualIdentity, email, password, phone, school };
    }

    case CoordinatorFormTypesEnum.REMOVE_COORDINATOR_FORM: {
      return {};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};
