export type Student = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { label: string; value: string };
  password: string;
  birtday: string;
  classId: { label: string; value: string };
};
