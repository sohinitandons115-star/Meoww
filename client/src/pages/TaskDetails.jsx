// TaskDetails Page - View and edit a single task
// Uses useState for form state and loading

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../api/taskApi.js';
import PageContainer from '../components/PageContainer.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDateTime } from '../utils/formatters.js';
import './TaskDetails.css';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch task using async/await
  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getTask(id);
        setTask(data);
        setFormData({
          title: data.title,
          description: data.description || '',
          status: data.status
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateTask(id, formData);
      setTask(updated);
      setEditing(false);
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  if (loading) return <LoadingState message="Loading task..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!task) return <ErrorState message="Task not found" />;

  return (
    <PageContainer title="Task Details">
      <div className="task-details">
        {editing ? (
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="task-header">
              <h2>{task.title}</h2>
              <StatusBadge status={task.status} />
            </div>
            <div className="task-info">
              <p><strong>Project:</strong> {task.project_name}</p>
              <p><strong>Created by:</strong> {task.created_by_name}</p>
              <p><strong>Created:</strong> {formatDateTime(task.created_at)}</p>
              <p><strong>Updated:</strong> {formatDateTime(task.updated_at)}</p>
            </div>
            {task.description && (
              <div className="task-description">
                <h3>Description</h3>
                <p>{task.description}</p>
              </div>
            )}
            <div className="task-actions">
              <button onClick={() => setEditing(true)} className="edit-button">
                Edit
              </button>
              <button onClick={handleDelete} className="delete-button">
                Delete
              </button>
              <Link to="/tasks" className="back-link">Back to Tasks</Link>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default TaskDetails;