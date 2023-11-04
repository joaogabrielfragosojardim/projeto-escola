export interface TeacherQuery {
  id: string;
  status: boolean;
  telephone: string;
  school: School;
  Classroom: Classroom[];
  user: User;
}

export interface School {
  id: string;
  name: string;
  project: Project;
}

export interface Project {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  period: string;
  year: number;
}

export interface User {
  email: string;
  name: string;
  visualIdentity: string | null;
}

export interface Teacher {
  id: string;
  status: boolean;
  visualIdentity: string | null;
  email: string;
  name: string;
  telephone: string;
  project: Project;
  school: {
    id: string;
    name: string;
  };
  classrooms: Classroom[];
}

export function toTeachers(teachers: TeacherQuery[]): Teacher[] {
  return teachers.map((teacher) => ({
    id: teacher.id,
    status: teacher.status,
    name: teacher.user.name,
    visualIdentity: teacher.user.visualIdentity,
    email: teacher.user.email,
    telephone: teacher.telephone,
    project: {
      id: teacher.school.project.id,
      name: teacher.school.project.name,
    },
    school: {
      id: teacher.school.id,
      name: teacher.school.name,
    },
    classrooms: teacher.Classroom,
  }));
}
