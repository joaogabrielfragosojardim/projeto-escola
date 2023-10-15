type SchoolQuery = {
  id: string;
  name: string;
  projectId: string;
  Address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
  };
};

type School = {
  id: string;
  name: string;
  projectId: string;
  address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
  };
};

export function toSchool(schools: SchoolQuery[]): School[] {
  return schools.map((school) => ({
    id: school.id,
    name: school.name,
    projectId: school.projectId,
    address: {
      ...school.Address,
    },
  }));
}
