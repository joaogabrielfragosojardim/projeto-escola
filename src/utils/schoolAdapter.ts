type SchoolQuery = {
  id: string;
  name: string;
  visualIdentity: string | null;
  project: {
    id: string;
    name: string;
  };
  Address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
    neighborhood: string;
    houseNumber: string;
  };
};

type School = {
  id: string;
  name: string;
  visualIdentity: string | null;
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
    visualIdentity: school?.visualIdentity ?? null,
    project: {
      id: school.project.id,
      name: school.project.name,
    },
    address: {
      ...school.Address,
    },
  }));
}
