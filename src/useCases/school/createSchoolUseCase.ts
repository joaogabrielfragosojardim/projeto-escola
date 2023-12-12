import { allPeriods, allSeries } from '@/constants/classroom';
import { prisma } from '@/lib/prisma';

interface CreateSchoolUseCaseRequest {
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

export class CreateSchoolUseCase {
  async execute({
    name,
    projectId,
    address,
    visualIdentity,
  }: CreateSchoolUseCaseRequest) {
    const { id: addressId } = await prisma.address.create({
      data: {
        zipCode: address.zipCode,
        city: address.city,
        state: address.state,
        street: address.street,
        houseNumber: address.houseNumber,
        neighborhood: address.neighborhood,
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
        visualIdentity,
      },
    });

    await prisma.classroom.createMany({
      data: allSeries
        .map((serie) => {
          return allPeriods.map((period) => ({
            schoolId: school.id,
            year: serie,
            period,
          }));
        })
        .flat(),
    });

    return {
      school,
    };
  }
}
