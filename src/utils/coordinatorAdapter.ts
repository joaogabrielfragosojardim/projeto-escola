interface CoordinatorQuery {
  id: string;
  telephone: string;
  school: School;
  status: boolean;
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
  visualIdentity: string | null;
}

export interface Coordinator {
  id: string;
  email: string;
  name: string;
  visualIdentity: string | null;
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
    status: coordinator.status,
    visualIdentity: coordinator.user.visualIdentity,
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

export function toCoordinator(coordinator: CoordinatorQuery): Coordinator {
  return {
    id: coordinator.id,
    name: coordinator.user.name,
    visualIdentity: coordinator.user.visualIdentity,
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
  };
}
