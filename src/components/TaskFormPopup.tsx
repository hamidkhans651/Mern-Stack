'use client';

import { useState, useEffect } from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskFormPopupProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, '_id'>) => Promise<void>;
  onClose: () => void;
}

export default function TaskFormPopup({ task, onSubmit, onClose }: TaskFormPopupProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 className="text-2xl font-bold" style={{ color: '#1a202c' }}>{task ? 'Edit Task' : 'Add New Task'}</h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer', marginLeft: 8 }}
              title="Close"
            >×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
                rows={3}
                placeholder="Enter task description"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 18px', background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}
              >Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
              >{isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 