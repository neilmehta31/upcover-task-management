import { IsNotEmpty, IsOptional, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from 'src/schema/tasks.schema';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement authentication' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Add JWT based authentication to the API' })
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ example: '2023-12-31' })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Implement authentication' })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Add JWT based authentication to the API' })
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ example: '2023-12-31' })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}

export class AssignTaskDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

export class TaskFilterDto {
  @ApiProperty({ required: false, enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ required: false, enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false, example: 1, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsOptional()
  limit?: number = 10;
}