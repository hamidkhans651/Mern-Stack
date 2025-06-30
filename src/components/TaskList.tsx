'use client';

import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskFormPopup from './TaskFormPopup';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 10;

  const fetchTasks = async (pageNum = 1, searchValue = search) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchValue)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: PaginatedTasks = await response.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      setError('Error loading tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    fetchTasks(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleAddTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      // Refetch first page after adding
      fetchTasks(1, search);
      setShowAddTask(false);
    } catch (err) {
      setError('Error adding task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Refetch current page after update
      fetchTasks(page, search);
    } catch (err) {
      setError('Error updating task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Refetch current page after delete
      fetchTasks(page, search);
    } catch (err) {
      setError('Error deleting task');
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || task.status === filter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div style={{ width: 48, height: 48, border: '4px solid #2563eb', borderTop: '4px solid transparent', borderRadius: '50%', margin: '40px auto', animation: 'spin 1s linear infinite' }} />
        <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
        <div className="mt-2 text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search by title..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setShowAddTask(true)}
          className="rounded shadow"
          style={{ background: '#2563eb', color: 'white', padding: '12px 28px', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
        >
          + Add New Task
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Task['status'] | 'all')}
            className="rounded"
            style={{ padding: '8px 16px', border: '1px solid #ccc', fontSize: 15 }}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
            className="rounded"
            style={{ padding: '8px 16px', border: '1px solid #ccc', fontSize: 15 }}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>
      {error && (
        <div className="rounded p-4 mb-4" style={{ background: '#fee2e2', color: '#b91c1c' }}>{error}</div>
      )}
      {showAddTask && (
        <TaskFormPopup
          onSubmit={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {filteredTasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
      {filteredTasks.length === 0 && !isLoading && (
        <div className="text-center mt-2 text-lg" style={{ color: '#888' }}>No tasks found. Add a new task to get started!</div>
      )}
      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc', background: page === 1 ? '#eee' : '#2563eb', color: page === 1 ? '#888' : 'white', fontWeight: 500, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 500 }}>
          Page {page} of {totalPages} ({total} tasks)
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc', background: page === totalPages ? '#eee' : '#2563eb', color: page === totalPages ? '#888' : 'white', fontWeight: 500, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
} 