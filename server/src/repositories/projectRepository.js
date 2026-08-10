// Project Repository - Database operations for projects
// Handles all direct database interactions for project data

import { query } from '../db/pool.js';

class ProjectRepository {
  // Get all projects with owner info
  async findAll() {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.owner_id,
        p.created_at,
        u.name AS owner_name,
        COUNT(t.id) AS task_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Get single project by ID with task count
  async findById(id) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.owner_id,
        p.created_at,
        u.name AS owner_name,
        COUNT(t.id) AS task_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.id = $1
      GROUP BY p.id, u.name
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  // Get projects by owner ID
  async findByOwnerId(ownerId) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.owner_id,
        p.created_at,
        u.name AS owner_name,
        COUNT(t.id) AS task_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.owner_id = $1
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
    `;
    const result = await query(sql, [ownerId]);
    return result.rows;
  }

  // Create new project
  async create(projectData) {
    const sql = `
      INSERT INTO projects (name, description, owner_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, name, description, owner_id, created_at
    `;
    const { name, description, ownerId } = projectData;
    const result = await query(sql, [name, description, ownerId]);
    return result.rows[0];
  }

  // Update existing project
  async update(id, projectData) {
    const sql = `
      UPDATE projects 
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING id, name, description, owner_id, created_at
    `;
    const { name, description } = projectData;
    const result = await query(sql, [name, description, id]);
    return result.rows[0];
  }

  // Delete project
  async delete(id) {
    const sql = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
}

export default new ProjectRepository();