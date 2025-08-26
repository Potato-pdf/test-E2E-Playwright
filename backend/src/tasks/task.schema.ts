import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 'todo' })
  status: 'todo' | 'inprogress' | 'done';

  @Prop()
  description?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
