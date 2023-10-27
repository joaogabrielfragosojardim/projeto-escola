import type { Coordinator } from '@/types/coordinator';

export const initialState: Coordinator = {
  id: '',
  name: '',
  visualIdentity: '',
  email: '',
  password: '',
  telephone: '',
  school: { id: '', name: '', value: '' },
  project: { id: '', name: '', value: '' },
};
