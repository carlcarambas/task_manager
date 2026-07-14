import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

const PRIORITY_WEIGHT: Record<string, number> = { low: 0, medium: 1, high: 2 };

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async findAll(query: QueryTaskDto): Promise<PaginatedTasks> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.TaskWhereInput = {
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.search && {
        // SQLite's `contains` doesn't support Prisma's `mode: 'insensitive'`
        // (Postgres/Mongo only) — its LIKE-based contains is already
        // case-insensitive for ASCII by default, so no mode is needed here.
        OR: [
          { title: { contains: query.search } },
          { description: { contains: query.search } },
        ],
      }),
    };

    // status/priority are plain string columns (SQLite has no enum type),
    // so a DB-level orderBy on priority would sort alphabetically (high,
    // low, medium) instead of by actual severity. Dataset sizes here are
    // small, so sort in memory instead.
    if (sortBy === 'priority') {
      const all = await this.prisma.task.findMany({ where });
      const sorted = all.sort((a, b) => {
        const diff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        return sortOrder === 'asc' ? diff : -diff;
      });
      const total = sorted.length;
      const start = (page - 1) * limit;
      return {
        data: sorted.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }
}
