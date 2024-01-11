export type Coordinator = {
  id: string;
  status: boolean;
  name: string;
  visualIdentity: string;
  email: string;
  password: string;
  telephone: string;
  schools: { id: string; name: string; value: string }[];
  projects: { id: string; name: string; value: string }[];
};

export type CoordinatorEdit = {
  visualIdentity?: string;
  name: string;
  telephone: string;
  schoolIds: string[];
};
