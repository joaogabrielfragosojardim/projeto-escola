import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateTeacherUseCaseRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  schoolId: string;
  visualIdentity?: string;
  classRooms: { year: number; period: string }[];
}

export class CreateTeacherUseCase {
  async execute({
    name,
    email,
    password,
    telephone,
    schoolId,
    visualIdentity,
    classRooms,
  }: CreateTeacherUseCaseRequest) {
    const teacherRole = await prisma.role.findUnique({
      where: {
        name: 'teacher',
      },
    });

    if (!teacherRole) {
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

    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      throw new AppError('Escola inexistente', 400);
    }

    const coordinator = await prisma.coordinator.findMany({
      where: {
        schoolId,
      },
    });

    if (!coordinator.length || !coordinator[0]) {
      throw new AppError('Coordenador não Existe', 400);
    }

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        visualIdentity,
        password: passwordHash,
        roleId: teacherRole.id,
      },
      select: {
        password: false,
        id: true,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        telephone,
        schoolId,
        coordinatorId: coordinator[0]?.id,
        userId: user.id,
      },
    });

    const years = classRooms.map((item) => item.year);
    const periods = classRooms.map((item) => item.period);

    await prisma.classroom.updateMany({
      where: { schoolId, year: { in: years }, period: { in: periods } },
      data: { teacherId: teacher.id },
    });

    return {
      teacher: { ...user, ...teacher },
    };
  }
}
