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
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        schoolId: true,
      },
    });

    const classroom = await prisma.classroom.findFirst({
      where: {
        schoolId: student?.schoolId,
        period: classRoom.period,
        year: classRoom.year,
      },
      select: {
        id: true,
      },
    });

    const newStudent = await prisma.student.update({
      where: { id },
      data: {
        birtday,
        registration,
        classId: classroom?.id,
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
      where: { id: newStudent.user.id },
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
        id: newStudent.id,
        name: user.name,
        visualIdentity: user?.visualIdentity,
        email: user.email,
        birtday: newStudent.birtday,
        registration: newStudent.registration,
        Classroom: {
          period: newStudent.Classroom.period,
          year: newStudent.Classroom.year,
        },
      },
    };
  }
}
