import type { School } from '@/types/school';

export const initialState: School = {
  name: '',
  city: '',
  state: '',
  street: '',
  cep: '',
  visualIdentity: '',
  projectId: { value: '', label: '' },
};
