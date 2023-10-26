interface CoordinatorQuery {
  id: string;
  telephone: string;
  school: School;
  user: User;
}

interface School {
  id: string;
  name: string;
  project: Project;
}

interface Project {
  id: string;
  name: string;
}

export interface User {
  email: string;
  name: string;
}

export interface Coordinator {
  id: string;
  email: string;
  name: string;
  telephone: string;
  project: Project;
  school: {
    id: string;
    name: string;
  };
}

export function toCoordinators(
  coordinators: CoordinatorQuery[],
): Coordinator[] {
  return coordinators.map((coordinator) => ({
    id: coordinator.id,
    name: coordinator.user.name,
    email: coordinator.user.email,
    telephone: coordinator.telephone,
    project: {
      id: coordinator.school.project.id,
      name: coordinator.school.project.name,
    },
    school: {
      id: coordinator.school.id,
      name: coordinator.school.name,
    },
  }));
}
