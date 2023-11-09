import { prisma } from '@/lib/prisma';

interface EditAttendenceUseCaseRequest {
  id: string | undefined;
  date: Date;
  isPresent: boolean;
}

export class EditAttendenceUseCase {
  async execute({ id, date, isPresent }: EditAttendenceUseCaseRequest) {
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        date,
        isPresent,
      },
    });

    return {
      attendance,
    };
  }
}
