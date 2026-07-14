import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tasks = [
  {
    title: 'Set up project repository',
    description: 'Initialize git, add README, configure CI',
    status: 'completed',
    priority: 'medium',
  },
  {
    title: 'Design task database schema',
    description: 'Model Task entity with status, priority, and due date',
    status: 'completed',
    priority: 'high',
  },
  {
    title: 'Build task CRUD API',
    description: 'Implement create, read, update, delete endpoints',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Add filtering and search',
    description: 'Support filtering by status/priority and text search',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Build frontend task list',
    description: 'Paginated, filterable list view with loading states',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Write unit tests',
    description: 'Cover validation, filtering, and CRUD logic',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Polish responsive layout',
    status: 'pending',
    priority: 'low',
  },
  {
    title: 'Write README',
    description: 'Document setup, API, schema, and known limitations',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
] as const;

async function main() {
  await prisma.task.deleteMany();
  await prisma.task.createMany({ data: [...tasks] });
  console.log(`Seeded ${tasks.length} tasks.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
