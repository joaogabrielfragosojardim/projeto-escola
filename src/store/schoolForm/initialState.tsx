import type { School } from '@/types/school';

export const initialState: School = {
  name: '',
  city: '',
  state: '',
  street: '',
  zipCode: '',
  visualIdentity: '',
  projectId: { value: '', label: '' },
};
