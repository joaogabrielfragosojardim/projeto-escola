import { prisma } from '@/lib/prisma';

interface CreateSchoolUseCaseRequest {
  name: string;
  projectId: string;
  address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
  };
}

export class CreateSchoolUseCase {
  async execute({ name, projectId, address }: CreateSchoolUseCaseRequest) {
    const { id: addressId } = await prisma.address.create({
      data: {
        zipCode: address.zipCode,
        city: address.city,
        state: address.state,
        street: address.street,
      },
      select: {
        id: true,
      },
    });

    const school = await prisma.school.create({
      data: {
        name,
        addressId,
        projectId,
      },
    });

    return {
      school,
    };
  }
}
