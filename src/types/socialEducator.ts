export type SocialEducator = {
  id?: string;
  name: string;
  email: string;
  visualIdentity?: string;
  school: { label: string; value: string; id: string; name: string };
  password: string;
  period: string;
  telephone: string;
  classrooms: { year: number; period: string }[];
};

export type SocialEducatorSchoolId = {
  name: string;
  email: string;
  visualIdentity?: string;
  schoolId: { id: string; value: string };
  password: string;
  period: string;
  classRooms?: { value: { period: string; series: string } }[];
  telephone?: string;
};

export type SocialEducatorEdit = {
  id?: string;
  name: string;
  visualIdentity?: string;
  telephone: string;
  classRooms: { label: string; value: { year: number; period: string } }[];
};

export type SocialEducatorEditRequest = {
  id?: string;
  name: string;
  visualIdentity?: string;
  telephone: string;
  classRooms: { year: number; period: string }[];
};
