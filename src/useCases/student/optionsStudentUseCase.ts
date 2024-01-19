import { prisma } from '@/lib/prisma';

interface OptionStudentUseCaseRequest {
  projectId?: string;
  classId?: string;
  schoolId?: string;
  teacherId?: string;
  coordinatorId?: string;
  period?: string;
  userId: string;
  year?: string;
}

export class OptionsStudentUseCase {
  async execute({
    projectId,
    classId,
    schoolId,
    teacherId,
    userId,
    period,
    coordinatorId,
    year,
  }: OptionStudentUseCaseRequest) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId,
      },
    });

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId,
      },
      select: {
        schools: {
          select: {
            schoolId: true,
          },
        },
      },
    });

    const students = await prisma.student.findMany({
      where: {
        AND: [
          {
            schoolId: {
              equals: schoolId,
            },
          },
          {
            schoolId: {
              in: coordinator?.schools.map((school) => school.schoolId),
            },
          },
        ],
        schoolId: {
          equals: schoolId,
        },
        Classroom: {
          id: {
            equals: classId,
          },
          teachers:
            teacherId || teacher?.id
              ? { some: { id: teacherId || teacher?.id } }
              : undefined,
          year: { equals: year },
          period: { equals: period },
        },
        school: {
          projectId: { equals: projectId },
          coordinators: {
            some: {
              coordinatorId: { equals: coordinatorId },
            },
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const options = students.map((student) => ({
      label: student.user.name,
      value: student.id,
    }));

    return {
      options,
    };
  }
}
