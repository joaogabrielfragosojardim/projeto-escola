import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface EditTeacherUseCaseRequest {
  id: string | undefined;
  telephone: string;
  name: string;
  visualIdentity?: string;
  classRooms: { year: number; period: string }[];
}

export class EditTeacherUseCase {
  async execute({
    id,
    name,
    telephone,
    visualIdentity,
    classRooms,
  }: EditTeacherUseCaseRequest) {
    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        telephone,
      },
      select: {
        id: true,
        telephone: true,
        schoolId: true,
        Classroom: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (teacher.Classroom.length) {
      await prisma.teacher.update({
        where: { id },
        data: {
          Classroom: {
            disconnect: teacher.Classroom.map((classRoom) => ({
              id: classRoom.id,
            })),
          },
        },
      });
    }

    const updates = classRooms.map(async ({ period, year }) => {
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

    await Promise.all(updates);

    const user = await prisma.user.update({
      where: { id: teacher.user.id },
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
      teacher: {
        id: teacher.id,
        name: user.name,
        visualIdentity: user?.visualIdentity,
        email: user.email,
        telephone: teacher.telephone,
        schoolId: teacher.schoolId,
        classRooms,
      },
    };
  }
}
