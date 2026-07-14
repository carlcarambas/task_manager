import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

type MockTask = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const makeTask = (overrides: Partial<MockTask>): MockTask => ({
  id: overrides.id ?? 'id-1',
  title: 'Task',
  status: 'pending',
  priority: 'medium',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('TasksService', () => {
  let service: TasksService;
  let prisma: {
    task: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(TasksService);
  });

  describe('create', () => {
    it('converts a string dueDate into a Date before writing', async () => {
      prisma.task.create.mockResolvedValue(makeTask({}));

      await service.create({ title: 'Ship it', dueDate: '2026-08-01' });

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ dueDate: new Date('2026-08-01') }),
      });
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns the task when it exists', async () => {
      const task = makeTask({ id: 'abc' });
      prisma.task.findUnique.mockResolvedValue(task);

      await expect(service.findOne('abc')).resolves.toEqual(task);
    });
  });

  describe('update / remove', () => {
    it('rejects updating a task that does not exist without writing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { title: 'New title' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.task.update).not.toHaveBeenCalled();
    });

    it('rejects deleting a task that does not exist without writing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.task.delete).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('paginates and reports totalPages from the DB count', async () => {
      prisma.task.findMany.mockResolvedValue([makeTask({ id: 'a' })]);
      prisma.task.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
      expect(result).toMatchObject({ total: 25, page: 2, limit: 10, totalPages: 3 });
    });

    it('sorts by priority severity (low < medium < high) instead of alphabetically', async () => {
      prisma.task.findMany.mockResolvedValue([
        makeTask({ id: 'low', priority: 'low' }),
        makeTask({ id: 'high', priority: 'high' }),
        makeTask({ id: 'medium', priority: 'medium' }),
      ]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'priority',
        sortOrder: 'asc',
      });

      expect(result.data.map((t) => t.id)).toEqual(['low', 'medium', 'high']);
    });

    it('builds an OR search across title and description', async () => {
      prisma.task.findMany.mockResolvedValue([]);
      prisma.task.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, search: 'urgent' });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'urgent' } },
              { description: { contains: 'urgent' } },
            ],
          },
        }),
      );
    });
  });
});
