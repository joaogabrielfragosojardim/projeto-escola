import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { generateEmail } from '@/utils/generateRandomEmail';
import { generatePassword } from '@/utils/generateRandomPassword';

interface CreateStudentUseCaseRequest {
  name: string;
  classId: string;
  schoolId: string;
  visualIdentity?: string;
  birtday: Date;
  registration: string;
}

export class CreateStudentUseCase {
  async execute({
    name,
    visualIdentity,
    schoolId,
    classId,
    birtday,
    registration,
  }: CreateStudentUseCaseRequest) {
    const studentRole = await prisma.role.findUnique({
      where: {
        name: 'student',
      },
    });

    if (!studentRole) {
      throw new AppError('Cargo inexistente', 400);
    }

    const email = generateEmail(name);

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    const password = generatePassword();

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        roleId: studentRole.id,
        visualIdentity,
      },
    });

    const classroom = await prisma.classroom.findFirst({
      where: {
        id: classId,
      },
      select: {
        school: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!classroom || classroom.school.id !== schoolId) {
      throw new AppError('Essa turma não está vinculada à essa escola', 400);
    }

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        schoolId,
        birtday,
        classId,
        registration,
      },
    });

    // @ts-ignore
    user.password = undefined;

    return {
      student: {
        user: {
          ...user,
        },
        ...student,
      },
    };
  }
}
