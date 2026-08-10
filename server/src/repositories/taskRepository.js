// Task Repository - Database operations for tasks
// This module handles all direct database interactions for task data

import { query, transaction } from '../db/pool.js';

class TaskRepository {
  // Get all tasks with project and creator info
  async findAll() {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.project_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        p.name AS project_name,
        u.name AS created_by_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Get single task by ID
  async findById(id) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.project_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        p.name AS project_name,
        u.name AS created_by_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  // Get tasks by project ID
  async findByProjectId(projectId) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.project_id,
        t.created_by,
        t.created_at,
        t.updated_at,
        p.name AS project_name,
        u.name AS created_by_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.created_by = u.id
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC
    `;
    const result = await query(sql, [projectId]);
    return result.rows;
  }

  // Create new task
  async create(taskData) {
    const sql = `
      INSERT INTO tasks (title, description, status, project_id, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, title, description, status, project_id, created_by, created_at, updated_at
    `;
    const { title, description, status, projectId, createdBy } = taskData;
    const result = await query(sql, [title, description, status, projectId, createdBy]);
    return result.rows[0];
  }

  // Update existing task
  async update(id, taskData) {
    const sql = `
      UPDATE tasks 
      SET title = $1, description = $2, status = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, description, status, project_id, created_by, created_at, updated_at
    `;
    const { title, description, status } = taskData;
    const result = await query(sql, [title, description, status, id]);
    return result.rows[0];
  }

  // Delete task
  async delete(id) {
    const sql = 'DELETE FROM tasks WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
}

export default new TaskRepository();