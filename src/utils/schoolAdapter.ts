type SchoolQuery = {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
  };
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
  project: {
    id: string;
    name: string;
  };
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
    project: {
      id: school.project.id,
      name: school.project.name,
    },
    address: {
      ...school.Address,
    },
  }));
}
