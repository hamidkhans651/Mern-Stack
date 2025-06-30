'use client';

import { useState } from 'react';
import TaskFormPopup from './TaskFormPopup';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, taskData: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const priorityColors: Record<string, string> = {
  low: '#bbf7d0', // green-100
  medium: '#fef9c3', // yellow-100
  high: '#fecaca', // red-100
};
const priorityText: Record<string, string> = {
  low: '#166534', // green-800
  medium: '#854d0e', // yellow-800
  high: '#991b1b', // red-800
};
const statusColors: Record<string, string> = {
  'todo': '#f3f4f6', // gray-100
  'in-progress': '#dbeafe', // blue-100
  'completed': '#ede9fe', // purple-100
};
const statusText: Record<string, string> = {
  'todo': '#374151', // gray-800
  'in-progress': '#1e40af', // blue-800
  'completed': '#6d28d9', // purple-800
};

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (taskData: Omit<Task, '_id'>) => {
    await onUpdate(task._id, taskData);
    setShowEdit(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await onDelete(task._id);
    }
  };

  return (
    <div className="rounded shadow" style={{ background: 'white', opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s', overflow: 'hidden' }}>
      <div className="p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h3 className="text-xl font-bold" style={{ color: '#1a202c', flex: 1 }}>{task.title}</h3>
          <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            <button
              onClick={() => setShowEdit(true)}
              style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#2563eb' }}
              title="Edit"
            >✏️</button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#b91c1c' }}
              title="Delete"
            >🗑️</button>
          </div>
        </div>
        <p className="mb-4" style={{ color: '#444', marginBottom: 16 }}>{task.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <span className="rounded p-4" style={{ background: priorityColors[task.priority], color: priorityText[task.priority], padding: '4px 14px', fontSize: 14, fontWeight: 600 }}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          <span className="rounded p-4" style={{ background: statusColors[task.status], color: statusText[task.status], padding: '4px 14px', fontSize: 14, fontWeight: 600 }}>
            {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          {task.dueDate && (
            <span className="rounded p-4" style={{ background: '#f3f4f6', color: '#374151', padding: '4px 14px', fontSize: 14, fontWeight: 600 }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      {showEdit && (
        <TaskFormPopup
          task={task}
          onSubmit={handleEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
} 