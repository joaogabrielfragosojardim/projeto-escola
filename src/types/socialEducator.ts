import type { ClassRoom } from '@/constants/classroom';

export type SocialEducator = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { label: string; value: string };
  password: string;
  telephone: string;
  classRooms: ClassRoom[];
};
