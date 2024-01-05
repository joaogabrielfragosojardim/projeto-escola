export interface Frequency {
  id: string;
  date: Date;
  student: {
    registration: string;
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
