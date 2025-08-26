import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Task, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, User]),
    TasksModule,
  ],
  providers: [AppService, AuthService],
  controllers: [AppController, AuthController],
})
export class AppModule {}
