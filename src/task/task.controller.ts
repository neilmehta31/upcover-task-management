import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    Query,
    UseGuards,
    Req,
    HttpStatus
  } from '@nestjs/common';
  import { TaskService } from './task.service';
  import {
    CreateTaskDto,
    UpdateTaskDto,
    AssignTaskDto,
    TaskFilterDto,
  } from './dto/task.dto';
  import { JwtAuthGuard } from '../auth/auth.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { Request } from 'express';
import { UserDocument } from 'src/schema/user.schema';
  
  @ApiTags('Tasks')
  @Controller('tasks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class TaskController {
    constructor(private taskService: TaskService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Task created successfully' })
    async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
      return this.taskService.createTask(createTaskDto, req.user as UserDocument);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all tasks with pagination and filtering' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Tasks retrieved successfully' })
    async getTasks(@Query() filterDto: TaskFilterDto) {
      return this.taskService.getTasks(filterDto);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Task retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
    async getTaskById(@Param('id') id: string) {
      return this.taskService.getTaskById(id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a task' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Task updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not authorized to update this task' })
    async updateTask(
      @Param('id') id: string,
      @Body() updateTaskDto: UpdateTaskDto,
      @Req() req: Request,
    ) {
      return this.taskService.updateTask(id, updateTaskDto, req.user as UserDocument);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a task' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Task deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not authorized to delete this task' })
    async deleteTask(@Param('id') id: string, @Req() req: Request) {
      return this.taskService.deleteTask(id, req.user as UserDocument);
    }
  
    @Post(':id/assign')
    @ApiOperation({ summary: 'Assign a task to another user' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Task assigned successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task or user not found' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only creator can assign tasks' })
    async assignTask(
      @Param('id') id: string,
      @Body() assignTaskDto: AssignTaskDto,
      @Req() req: Request,
    ) {
      return this.taskService.assignTask(id, assignTaskDto, req.user as UserDocument);
    }
  }