import { prisma } from '@/lib/prisma';

interface EditSchoolUseCaseRequest {
  id?: string;
  name: string;
  projectId: string;
  address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
  };
}

export class EditSchoolUseCase {
  async execute({ id, name, projectId, address }: EditSchoolUseCaseRequest) {
    const school = await prisma.school.update({
      where: { id },
      data: {
        name,
        projectId,
      },
    });

    const newAddress = await prisma.address.update({
      where: { id: school.addressId },
      data: {
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        street: address.street,
      },
    });

    return {
      school: {
        name: school.name,
        projectId: school.projectId,
        address: newAddress,
      },
    };
  }
}
