export type Coordinator = {
  id: string;
  name: string;
  visualIdentity: string;
  email: string;
  password: string;
  telephone: string;
  school: { id: string; name: string; value: string };
  project: { id: string; name: string; value: string };
};
