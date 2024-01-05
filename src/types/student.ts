export type Student = {
  id: string;
  status: boolean;
  name: string;
  email: string;
  registration: string;
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
  registration: string;
  schoolId: string;
  password: string;
  birtday: string;
  classId: string;
};

export interface StudentEdit {
  id: string;
  birtday: Date;
  registration: string;
  user: {
    email: string;
    name: string;
    visualIdentity: string;
  };
  school: {
    id: string;
    name: string;
  };
  Classroom: {
    period: string;
    year: number;
  };
}

export interface StudentEditForm {
  birtday: Date;
  name: string;
  registration: string;
  visualIdentity: string;
  classRoom: {
    period: string;
    year: number;
  };
}
