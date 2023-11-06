interface PedagogicalVisit {
  date: Date;
  Classroom: { teacher: User | null; year: number; period: string; id: string };
  Coordinator: User | null;
}

interface User {
  user: {
    name: string;
  };
}

export const toPedagogicalVisits = (data: PedagogicalVisit[]) => {
  return data.map((item) => ({
    date: item.date,
    teacher: item?.Classroom?.teacher?.user.name,
    coordinator: item?.Coordinator?.user.name,
    classroom: {
      year: item.Classroom.year,
      period: item.Classroom.period,
      id: item.Classroom.id,
    },
  }));
};
