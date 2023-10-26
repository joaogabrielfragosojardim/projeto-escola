import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
  classId: string;
  schoolId: string;
  profileUrl?: string;
  birtday: Date;
}

export class CreateStudentUseCase {
  async execute({
    name,
    email,
    password,
    profileUrl,
    schoolId,
    classId,
    birtday,
  }: CreateStudentUseCaseRequest) {
    const studentRole = await prisma.role.findUnique({
      where: {
        name: 'student',
      },
    });

    if (!studentRole) {
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
        roleId: studentRole.id,
        profileUrl,
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
