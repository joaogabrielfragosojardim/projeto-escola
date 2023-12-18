import { prisma } from '@/lib/prisma';

interface EditStudentUseCaseRequest {
  id: string | undefined;
  birtday: Date;
  name: string;
  visualIdentity?: string;
  registration: string;
  classRoom: { year: string; period: string };
}

export class EditStudentUseCase {
  async execute({
    id,
    birtday,
    name,
    visualIdentity,
    classRoom,
    registration,
  }: EditStudentUseCaseRequest) {
    const student = await prisma.student.update({
      where: { id },
      data: {
        birtday,
        registration,
        Classroom: {
          update: {
            period: classRoom.period,
            year: classRoom.year,
          },
        },
      },
      select: {
        id: true,
        birtday: true,
        registration: true,
        Classroom: {
          select: {
            period: true,
            year: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const user = await prisma.user.update({
      where: { id: student.user.id },
      data: {
        name,
        visualIdentity,
      },
      select: {
        name: true,
        email: true,
        visualIdentity: true,
      },
    });

    return {
      student: {
        id: student.id,
        name: user.name,
        visualIdentity: user?.visualIdentity,
        email: user.email,
        birtday: student.birtday,
        registration: student.registration,
        Classroom: {
          period: student.Classroom.period,
          year: student.Classroom.year,
        },
      },
    };
  }
}
