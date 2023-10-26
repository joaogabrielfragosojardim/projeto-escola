import type { Coordinator } from '@/types/coordinator';

export const initialState: Coordinator = {
  id: '',
  name: '',
  visualIdentity: '',
  email: '',
  password: '',
  phone: '',
  school: { id: '', name: '' },
};
