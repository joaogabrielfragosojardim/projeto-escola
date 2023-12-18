interface PedagogicalVisit {
  id: string;
  date: Date;
  Classroom: { teacher: User | null; year: string; period: string; id: string };
  Coordinator: User | null;
}

interface User {
  user: {
    name: string;
    id: string;
  };
}

export const toPedagogicalVisits = (data: PedagogicalVisit[]) => {
  return data.map((item) => ({
    id: item.id,
    date: item.date,
    teacher: {
      name: item?.Classroom?.teacher?.user.name,
      id: item?.Classroom?.teacher?.user.id,
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
