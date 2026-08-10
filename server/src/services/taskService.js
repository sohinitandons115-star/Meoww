// Task Service - Business logic for tasks
// Contains business rules and orchestrates between controller and repository

import taskRepository from '../repositories/taskRepository.js';

class TaskService {
  // Get all tasks
  async getAllTasks() {
    return await taskRepository.findAll();
  }

  // Get task by ID with validation
  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      error.code = 'TASK_NOT_FOUND';
      throw error;
    }
    return task;
  }

  // Get tasks by project
  async getTasksByProject(projectId) {
    return await taskRepository.findByProjectId(projectId);
  }

  // Create new task with validation
  async createTask(taskData) {
    // Validation
    if (!taskData.title || taskData.title.trim() === '') {
      const error = new Error('Title is required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    if (!taskData.projectId) {
      const error = new Error('Project ID is required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    if (!taskData.status || !['todo', 'in_progress', 'completed'].includes(taskData.status)) {
      const error = new Error('Invalid status. Must be: todo, in_progress, or completed');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    return await taskRepository.create({
      title: taskData.title.trim(),
      description: taskData.description || '',
      status: taskData.status,
      projectId: taskData.projectId,
      createdBy: taskData.createdBy || 1 // Default user
    });
  }

  // Update task with validation
  async updateTask(id, taskData) {
    // Check if task exists
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      error.code = 'TASK_NOT_FOUND';
      throw error;
    }

    // Validate status if provided
    if (taskData.status && !['todo', 'in_progress', 'completed'].includes(taskData.status)) {
      const error = new Error('Invalid status. Must be: todo, in_progress, or completed');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    return await taskRepository.update(id, {
      title: taskData.title ? taskData.title.trim() : existingTask.title,
      description: taskData.description !== undefined ? taskData.description : existingTask.description,
      status: taskData.status || existingTask.status
    });
  }

  // Delete task
  async deleteTask(id) {
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      error.code = 'TASK_NOT_FOUND';
      throw error;
    }

    return await taskRepository.delete(id);
  }
}

export default new TaskService();