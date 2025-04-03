import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto, TaskFilterDto } from './dto/task.dto';
import { Task, TaskDocument,  } from 'src/schema/tasks.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: UserDocument): Promise<TaskDocument> {
    const newTask = new this.taskModel({
      ...createTaskDto,
      creator: user._id,
    });
    
    return newTask.save();
  }

  async getTasks(filterDto: TaskFilterDto) {
    const { status, priority, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;
    
    const query = this.taskModel.find({ isDeleted: false });
    
    if (status) {
      query.where('status').equals(status);
    }
    
    if (priority) {
      query.where('priority').equals(priority);
    }
    
    const totalCount = await this.taskModel.countDocuments(query.getQuery());
    const tasks = await query
      .skip(skip)
      .limit(limit)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .exec();
    
    return {
      data: tasks,
      meta: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({ _id: id, isDeleted: false })
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .exec();
      
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: UserDocument): Promise<TaskDocument> {
    const task = await this.getTaskById(id);
    
    // Check if the user is the creator of the task
    if (task.creator.email.toString() !== user.email.toString()) {
      throw new ForbiddenException('You can only update tasks that you created');
    }
    
    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async deleteTask(id: string, user: UserDocument): Promise<TaskDocument> {
    const task = await this.getTaskById(id);
    
    // Check if the user is the creator of the task
    if (task.creator.email.toString() !== user.email.toString()) {
      throw new ForbiddenException('You can only delete tasks that you created');
    }
    
    task.isDeleted = true;
    return task.save();
  }

  async assignTask(id: string, assignTaskDto: AssignTaskDto, user: UserDocument): Promise<TaskDocument> {
    const task = await this.getTaskById(id);
    
    // Check if the user is the creator of the task
    if (task.creator.email.toString() !== user.email.toString()) {
      throw new ForbiddenException('Only the creator can assign this task');
    }
    
    // Find the user to assign to
    const assignedUser = await this.userModel.findById(assignTaskDto.userId).exec();
    if (!assignedUser) {
      throw new NotFoundException(`User with ID ${assignTaskDto.userId} not found`);
    }
    
    task.assignedTo = assignedUser;
    return task.save();
  }
}