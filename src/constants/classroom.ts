export const allSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const allPeriods = ['Matutino', 'Vespertino', 'Noturno'];

export type ClassRoom = {
  label: string;
  value: {
    series: number;
    period: string;
  };
};

export const classrooms: ClassRoom[] = allSeries.flatMap((series) =>
  allPeriods.map((period) => ({
    label: `${series}º ano - ${period}`,
    value: {
      series,
      period,
    },
  })),
);
