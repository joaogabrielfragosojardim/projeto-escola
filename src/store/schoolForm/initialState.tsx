import type { School } from '@/types/school';

export const initialState: School = {
  id: '',
  name: '',
  city: '',
  state: '',
  street: '',
  zipCode: '',
  visualIdentity: '',
  houseNumber: '',
  neighborhood: '',
  projectId: { value: '', label: '' },
};
