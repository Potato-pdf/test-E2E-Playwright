import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async create(title: string, description?: string): Promise<Task> {
    const createdTask = new this.taskModel({ title, description });
    return createdTask.save();
  }

  async updateStatus(id: string, status: string): Promise<Task | null> {
    return this.taskModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async remove(id: string): Promise<any> {
    return this.taskModel.findByIdAndDelete(id);
  }
}
