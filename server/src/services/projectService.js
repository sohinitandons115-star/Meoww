// Project Service - Business logic for projects
// Contains business rules and orchestrates between controller and repository

import projectRepository from '../repositories/projectRepository.js';

class ProjectService {
  // Get all projects
  async getAllProjects() {
    return await projectRepository.findAll();
  }

  // Get project by ID
  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }
    return project;
  }

  // Get projects by owner
  async getProjectsByOwner(ownerId) {
    return await projectRepository.findByOwnerId(ownerId);
  }

  // Create new project with validation
  async createProject(projectData) {
    if (!projectData.name || projectData.name.trim() === '') {
      const error = new Error('Project name is required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    return await projectRepository.create({
      name: projectData.name.trim(),
      description: projectData.description || '',
      ownerId: projectData.ownerId || 1 // Default user
    });
  }

  // Update project
  async updateProject(id, projectData) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    return await projectRepository.update(id, {
      name: projectData.name ? projectData.name.trim() : existingProject.name,
      description: projectData.description !== undefined ? projectData.description : existingProject.description
    });
  }

  // Delete project
  async deleteProject(id) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    return await projectRepository.delete(id);
  }
}

export default new ProjectService();