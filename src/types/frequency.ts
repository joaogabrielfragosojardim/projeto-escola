export interface Frequency {
  id: string;
  date: Date;
  student: {
    user: {
      name: string;
    };
  };
  Classroom: {
    year: number;
    period: string;
  };
  isPresent: boolean;
}
