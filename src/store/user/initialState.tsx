import type { User } from '@/types/user';

export const initialState: User = {
  id: '',
  name: '',
  email: '',
  isFirstAccess: false,
  role: {
    name: '',
  },
  visualIdentity: '',
};
