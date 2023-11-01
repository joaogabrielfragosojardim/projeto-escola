import type { ClassRoom } from '@/constants/classroom';

export type SocialEducator = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { label: string; value: string };
  password: string;
  period: string;
  telephone: string;
  classRooms: ClassRoom[];
};

export type SocialEducatorSchoolId = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: string;
  password: string;
  period: string;
  telephone: string;
};
