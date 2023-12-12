export type School = {
  id: string;
  name: string;
  city: string;
  state: string;
  street: string;
  zipCode: string;
  houseNumber: string;
  neighborhood: string;
  visualIdentity: string;
  projectId: { value: string; label: string };
};

export type SchollAddress = {
  id: string;
  name: string;
  visualIdentity: string;
  address: { city: string; state: string; street: string; zipCode: string };
  project: { name: string; id: string };
};

export type SchoolEdit = {
  name: string;
  address: { city: string; state: string; street: string; zipCode: string };
  visualIdentity: string;
  projectId: string;
};
