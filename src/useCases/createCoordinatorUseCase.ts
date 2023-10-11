import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateCoordinatorUseCaseRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  schoolId: string;
}

export class CreateCoordinatorUseCase {
  async execute({
    name,
    email,
    password,
    telephone,
    schoolId,
  }: CreateCoordinatorUseCaseRequest) {
    const coordinatorRole = await prisma.role.findUnique({
      where: {
        name: 'coordinator',
      },
    });

    if (!coordinatorRole) {
      throw new AppError('Cargo inexistente', 400);
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId: coordinatorRole.id,
      },
    });

    const coordinator = await prisma.coordinator.create({
      data: {
        telephone,
        userId: user.id,
        schoolId,
      },
    });

    // @ts-ignore
    user.password = undefined;

    return {
      coordinator: { ...user, ...coordinator },
    };
  }
}
