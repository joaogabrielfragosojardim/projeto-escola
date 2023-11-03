import { prisma } from '@/lib/prisma';
import { toStudents } from '@/utils/studentAdapter';

interface GetAllStudentUseCaseRequest {
  perPage: number;
  page: number;
  projectId?: string;
  classId?: string;
  schoolId?: string;
  teacherId?: string;
}

export class GetAllStudentUseCase {
  async execute({
    page,
    perPage,
    classId,
    projectId,
    schoolId,
    teacherId,
  }: GetAllStudentUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [student, total] = await prisma.$transaction([
      prisma.student.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          classId: { equals: classId },
          schoolId: { equals: schoolId },
          school: {
            projectId: { equals: projectId },
          },
          Classroom: {
            teacherId: { equals: teacherId },
          },
        },
        select: {
          id: true,
          birtday: true,
          user: {
            select: {
              visualIdentity: true,
              email: true,
              name: true,
            },
          },
          Classroom: {
            select: {
              period: true,
              year: true,
            },
          },
          school: {
            select: {
              id: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.student.count({
        where: {
          classId: { equals: classId },
          schoolId: { equals: schoolId },
          school: {
            projectId: { equals: projectId },
          },
          Classroom: {
            teacherId: { equals: teacherId },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toStudents(student),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
