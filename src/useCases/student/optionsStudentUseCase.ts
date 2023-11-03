import { prisma } from '@/lib/prisma';

interface OptionStudentUseCaseRequest {
  projectId?: string;
  classId?: string;
  schoolId?: string;
  teacherId?: string;
}

export class OptionsStudentUseCase {
  async execute({
    projectId,
    classId,
    schoolId,
    teacherId,
  }: OptionStudentUseCaseRequest) {
    const students = await prisma.student.findMany({
      where: {
        schoolId: {
          equals: schoolId,
        },
        Classroom: {
          id: {
            equals: classId,
          },
          teacherId: {
            equals: teacherId,
          },
        },
        school: {
          projectId: { equals: projectId },
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
