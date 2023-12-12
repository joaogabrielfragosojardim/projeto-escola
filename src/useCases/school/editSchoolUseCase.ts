import { prisma } from '@/lib/prisma';

interface EditSchoolUseCaseRequest {
  id?: string;
  name: string;
  projectId: string;
  visualIdentity?: string;
  address: {
    zipCode: string;
    city: string;
    state: string;
    street: string;
    neighborhood: string;
    houseNumber: string;
  };
}

export class EditSchoolUseCase {
  async execute({
    id,
    name,
    projectId,
    visualIdentity,
    address,
  }: EditSchoolUseCaseRequest) {
    const school = await prisma.school.update({
      where: { id },
      data: {
        name,
        projectId,
        visualIdentity,
      },
    });

    const newAddress = await prisma.address.update({
      where: { id: school.addressId },
      data: {
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        street: address.street,
        neighborhood: address.neighborhood,
        houseNumber: address.houseNumber,
      },
    });

    return {
      school: {
        id: school.id,
        name: school.name,
        visualIdentity: school.visualIdentity,
        projectId: school.projectId,
        address: newAddress,
      },
    };
  }
}
