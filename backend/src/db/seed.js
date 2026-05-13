const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.dev' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'admin@taskflow.dev',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create member users
  const memberPassword = await bcrypt.hash('member123', 12);
  const member1 = await prisma.user.upsert({
    where: { email: 'priya@taskflow.dev' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'priya@taskflow.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'james@taskflow.dev' },
    update: {},
    create: {
      name: 'James Lee',
      email: 'james@taskflow.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  // Create projects
  const project1 = await prisma.project.upsert({
    where: { id: 'proj-website' },
    update: {},
    create: {
      id: 'proj-website',
      name: 'Website Redesign',
      description: 'Full overhaul of the company website with new brand identity.',
      color: '#7c6ff7',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'proj-mobile' },
    update: {},
    create: {
      id: 'proj-mobile',
      name: 'Mobile App v2',
      description: 'Launch the second version of the mobile application.',
      color: '#3dd68c',
      ownerId: admin.id,
    },
  });

  // Add members to projects
  await prisma.projectMember.createMany({
    data: [
      { userId: admin.id, projectId: project1.id },
      { userId: member1.id, projectId: project1.id },
      { userId: member2.id, projectId: project1.id },
      { userId: admin.id, projectId: project2.id },
      { userId: member2.id, projectId: project2.id },
    ],
    skipDuplicates: true,
  });

  // Create tasks
  const now = new Date();
  const day = 86400000;

  await prisma.task.createMany({
    data: [
      {
        title: 'Design new homepage layout',
        description: 'Figma mockups for all breakpoints.',
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: admin.id,
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date(now.getTime() - 2 * day),
      },
      {
        title: 'Implement hero section',
        description: 'Build responsive hero with animations.',
        projectId: project1.id,
        assigneeId: member2.id,
        creatorId: admin.id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(now.getTime() + 3 * day),
      },
      {
        title: 'Write unit tests',
        projectId: project1.id,
        assigneeId: admin.id,
        creatorId: admin.id,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(now.getTime() + 7 * day),
      },
      {
        title: 'Set up CI pipeline',
        projectId: project2.id,
        assigneeId: admin.id,
        creatorId: admin.id,
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date(now.getTime() - 5 * day),
      },
      {
        title: 'Build onboarding flow',
        description: 'User onboarding screens and logic.',
        projectId: project2.id,
        assigneeId: member2.id,
        creatorId: admin.id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(now.getTime() - 1 * day),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin:  admin@taskflow.dev / admin123');
  console.log('  Member: priya@taskflow.dev / member123');
  console.log('  Member: james@taskflow.dev / member123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
