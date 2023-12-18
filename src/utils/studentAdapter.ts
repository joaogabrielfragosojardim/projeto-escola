export interface StudentQuery {
  id: string;
  status: boolean;
  birtday: Date;
  registration: string;
  user: User;
  Classroom: Classroom;
  school: School;
}

export interface User {
  email: string;
  name: string;
  visualIdentity: string | null;
}

export interface Classroom {
  period: string;
  year: string;
}

export interface School {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
  };
}

type Student = {
  id: string;
  status: boolean;
  name: string;
  birtday: Date;
  registration: string;
  visualIdentity: string | null;
  school: {
    id: string;
    name: string;
  };
  classroom: {
    period: string;
    year: string;
  };
};

export function toStudents(students: StudentQuery[]): Student[] {
  return students.map((student) => ({
    id: student.id,
    status: student.status,
    name: student.user.name,
    registration: student.registration,
    birtday: student.birtday,
    email: student.user.email,
    visualIdentity: student.user?.visualIdentity,
    project: {
      id: student.school.project.id,
      name: student.school.project.name,
    },
    school: {
      id: student.school.id,
      name: student.school.name,
    },
    classroom: {
      period: student.Classroom.period,
      year: student.Classroom.year,
    },
  }));
}
