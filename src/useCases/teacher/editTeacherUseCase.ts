import { prisma } from '@/lib/prisma';

interface EditTeacherUseCaseRequest {
  id: string | undefined;
  telephone: string;
  name: string;
  visualIdentity?: string;
  classRooms: { year: string; period: string }[];
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

      const classRooomsToConnect: any = await Promise.all(
        classRooms.map(async ({ period, year }) => {
          return prisma.classroom.findFirst({
            where: {
              schoolId: teacher.schoolId,
              period,
              year,
            },
          });
        }),
      );

      await prisma.teacher.update({
        where: { id },
        data: {
          Classroom: {
            connect: classRooomsToConnect,
          },
        },
      });
    }

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
