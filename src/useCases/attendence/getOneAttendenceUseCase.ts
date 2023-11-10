import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneAttendenceRequest {
  id?: string;
}

export class GetOneAttendenceUseCase {
  async execute({ id }: GetOneAttendenceRequest) {
    const attendance = await prisma.attendance.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        date: true,
        isPresent: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
                visualIdentity: true,
                name: true,
              },
            },
          },
        },
        Classroom: {
          select: {
            id: true,
            period: true,
            year: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new AppError('Frequ&encia não encontrada', 400);
    }

    return {
      attendance: {
        id: attendance.id,
        date: attendance.date,
        isPresent: attendance.isPresent,
        student: {
          id: attendance.student.id,
          name: attendance.student.user.name,
          visualIdentity: attendance.student.user.visualIdentity,
        },
        classroom: {
          id: attendance.Classroom.id,
          period: attendance.Classroom.period,
          year: attendance.Classroom.year,
        },
      },
    };
  }
}
