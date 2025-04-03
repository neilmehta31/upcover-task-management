import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo: User;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);