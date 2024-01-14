export const allSeries = [
  '1º ano',
  '2º ano',
  '3º ano',
  '4º ano',
  '5º ano',
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
  'EJA III',
  'EJA IV',
];

export const allPeriods = ['Manhã', 'Tarde', 'Noite'];

export type ClassRoom = {
  label: string;
  value: {
    series: number | string;
    period: string;
  };
};

export const classrooms: ClassRoom[] = allSeries.flatMap((series) =>
  allPeriods.map((period) => ({
    label: `${series} - ${period}`,
    value: {
      series,
      period,
    },
  })),
);
