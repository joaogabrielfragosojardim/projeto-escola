import type { ClassRoom } from '@/constants/classroom';

export type SocialEducator = {
  id?: string;
  name: string;
  email: string;
  visualIdentity?: string;
  school: { label: string; value: string; id: string; name: string };
  password: string;
  period: string;
  telephone: string;
  classRooms: ClassRoom[];
};

export type SocialEducatorSchoolId = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { id: string; value: string };
  password: string;
  period: string;
  classRooms?: { value: { period: string; series: string } }[];
};
