import type { Coordinator } from '@/types/coordinator';

export const initialState: Coordinator = {
  id: '',
  status: true,
  name: '',
  visualIdentity: '',
  email: '',
  password: '',
  telephone: '',
  schools: [],
  projects: [],
};
