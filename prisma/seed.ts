import { PrismaClient } from '@prisma/client';
import pkg from 'bcryptjs';

const { hash } = pkg;

const prisma = new PrismaClient();

const ROLES = [
  {
    name: 'master',
    description: 'Administrador Master',
    level: 5,
  },
  {
    name: 'administrator',
    description: 'Administrador',
    level: 4,
  },
  {
    name: 'coordinator',
    description: 'Coordenador',
    level: 3,
  },
  {
    name: 'teacher',
    description: 'Educador Social',
    level: 2,
  },
  {
    name: 'student',
    description: 'Aluno',
    level: 1,
  },
];

async function createRoles() {
  const createRolePromises = ROLES.map((role) =>
    prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        level: role.level,
      },
    }),
  );

  await Promise.all(createRolePromises);
}

async function createUserMaster() {
  const passwordHash = await hash('Prime123@', 6);

  await prisma.user.create({
    data: {
      email: 'joao@email.com',
      name: 'Joao Gabriel',
      password: passwordHash,
      roleId: 'f12fcbc3-6503-4034-b957-ef6d6edcdacf',
    },
  });
}

async function main() {
  try {
    await createUserMaster();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });