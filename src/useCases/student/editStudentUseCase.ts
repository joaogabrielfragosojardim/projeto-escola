import { prisma } from '@/lib/prisma';

interface EditStudentUseCaseRequest {
  id: string | undefined;
  birtday: Date;
  name: string;
  visualIdentity?: string;
  classRoom: { year: number; period: string };
}

export class EditStudentUseCase {
  async execute({
    id,
    birtday,
    name,
    visualIdentity,
    classRoom,
  }: EditStudentUseCaseRequest) {
    const student = await prisma.student.update({
      where: { id },
      data: {
        birtday,
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
        Classroom: {
          period: student.Classroom.period,
          year: student.Classroom.year,
        },
      },
    };
  }
}
