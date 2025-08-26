import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async create(title: string, description?: string): Promise<Task> {
    const task = this.taskRepository.create({ title, description });
    return this.taskRepository.save(task);
  }

  async updateStatus(id: number, status: 'todo' | 'inprogress' | 'done'): Promise<Task | null> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) return null;
    task.status = status;
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<any> {
    return this.taskRepository.delete(id);
  }
}
