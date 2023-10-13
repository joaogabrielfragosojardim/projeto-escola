import { prisma } from '@/lib/prisma';

interface EditUserUseCaseRequest {
  id: string | undefined;
  name: string;
}

export class EditUserUseCase {
  async execute({ id, name }: EditUserUseCaseRequest) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
      },
    });

    return {
      user,
    };
  }
}
