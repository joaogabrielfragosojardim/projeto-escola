import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { generatePassword } from '@/utils/generateRandomPassword';
import { sendPasswordEmail } from '@/utils/sendPasswordEmail';

interface CreateCoordinatorUseCaseRequest {
  name: string;
  email: string;
  telephone: string;
  schoolIds: string[];
  visualIdentity?: string;
}

export class CreateCoordinatorUseCase {
  async execute({
    name,
    email,
    telephone,
    visualIdentity,
    schoolIds,
  }: CreateCoordinatorUseCaseRequest) {
    const coordinatorRole = await prisma.role.findUnique({
      where: {
        name: 'coordinator',
      },
    });

    if (!coordinatorRole) {
      throw new AppError('Cargo inexistente', 400);
    }

    const schools = await prisma.school.findMany({
      where: {
        id: { in: schoolIds },
      },
      select: {
        id: true,
      },
    });

    if (schools.length === 0) {
      throw new AppError('Escolas inexistentes', 400);
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    const coordinatorWithSameTelephone = await prisma.coordinator.findUnique({
      where: {
        telephone,
      },
    });

    if (coordinatorWithSameTelephone) {
      throw new AppError('Telefone já cadastrado', 400);
    }

    const password = generatePassword();

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        visualIdentity,
        password: passwordHash,
        roleId: coordinatorRole.id,
      },
      select: {
        password: false,
        id: true,
        name: true,
        email: true,
      },
    });

    const newSchools = schoolIds.map((schoolId) => ({
      school: {
        connect: {
          id: schoolId,
        },
      },
    }));

    const coordinator = await prisma.coordinator.create({
      data: {
        telephone,
        userId: user.id,
        schools: {
          create: [...newSchools],
        },
      },
    });

    sendPasswordEmail({ password, name: user.name, email: user.email });

    return {
      coordinator: { ...user, ...coordinator },
    };
  }
}
