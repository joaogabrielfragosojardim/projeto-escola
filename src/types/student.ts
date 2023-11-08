export type Student = {
  id: string;
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { label: string; value: string };
  password: string;
  birtday: string;
  classId: { label: string; value: string };
  classroom: {
    period: string;
    year: number;
  };
  school: {
    name: string;
  };
};

export type StudentId = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: string;
  password: string;
  birtday: string;
  classId: string;
};
