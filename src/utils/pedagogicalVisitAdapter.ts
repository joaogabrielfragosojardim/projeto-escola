import type { JsonValue } from '@prisma/client/runtime/library';

interface PedagogicalVisit {
  id: string;
  date: Date;
  frequency: number;
  observations: string;
  questions: JsonValue;
  Teacher: { id: string; user: { name: string } };
  Classroom: { year: string; period: string; id: string };
  Coordinator: User | null;
  School: School;
}

interface User {
  user: {
    name: string;
    id: string;
  };
}

type School = {
  id: string;
  name: string;
};

export const toPedagogicalVisits = (data: PedagogicalVisit[]) => {
  return data.map((item) => ({
    id: item.id,
    date: item.date,
    frequency: item.frequency,
    observations: item.observations,
    questions: item.questions,
    school: {
      id: item.School.id,
      name: item.School.name,
    },
    teacher: {
      name: item?.Teacher?.user.name,
      id: item?.Teacher?.id,
    },
    coordinator: {
      name: item?.Coordinator?.user.name,
      id: item?.Coordinator?.user.id,
    },
    classroom: {
      year: item.Classroom.year,
      period: item.Classroom.period,
      id: item.Classroom.id,
    },
  }));
};
