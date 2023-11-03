export type User = {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
  };
  visualIdentity?: string;
  password?: string;
};
