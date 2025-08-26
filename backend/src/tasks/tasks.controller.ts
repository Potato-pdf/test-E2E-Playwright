import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('assignedTo') assignedTo?: string,
    @Body('details') details?: string,
  ) {
    return this.tasksService.create(title, description, assignedTo, details);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'todo' | 'inprogress' | 'done',
  ) {
    return this.tasksService.updateStatus(id, status);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: number,
    @Body() data: any,
  ) {
    return this.tasksService.updateTask(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }
}
