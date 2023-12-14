import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { generatePassword } from '@/utils/generateRandomPassword';
import { sendPasswordEmail } from '@/utils/sendPasswordEmail';

interface CreateTeacherUseCaseRequest {
  name: string;
  email: string;
  telephone: string;
  schoolId: string;
  visualIdentity?: string;
  classRooms: { year: number; period: string }[];
}

export class CreateTeacherUseCase {
  async execute({
    name,
    email,
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

    const teacherWithSameTelephone = await prisma.teacher.findUnique({
      where: {
        telephone,
      },
    });

    if (teacherWithSameTelephone) {
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
        roleId: teacherRole.id,
      },
      select: {
        password: false,
        id: true,
        name: true,
        email: true,
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

    const updateTeachers = classRooms.map(async ({ period, year }) => {
      const existingTeacherInClass = await prisma.classroom.findFirst({
        where: {
          schoolId: teacher.schoolId,
          period,
          year,
          teacherId: { not: null },
        },
        select: {
          year: true,
          period: true,
          teacher: {
            select: {
              user: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (existingTeacherInClass) {
        throw new AppError(
          `A turma ${existingTeacherInClass.year}º ano - ${existingTeacherInClass.period} já está atrelada ao professor ${existingTeacherInClass.teacher?.user.name}`,
          400,
        );
      }

      return prisma.classroom.updateMany({
        where: {
          schoolId: teacher.schoolId,
          period,
          year,
        },
        data: {
          teacherId: teacher.id,
        },
      });
    });

    await Promise.all(updateTeachers);

    sendPasswordEmail({ password, name: user.name, email: user.email });

    return {
      teacher: { ...user, ...teacher },
    };
  }
}
