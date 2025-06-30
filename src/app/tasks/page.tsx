import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/authOptions';
import TaskList from '@/components/TaskList';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <p className="mt-2" style={{ color: '#555' }}>
            Manage and organize your tasks efficiently
          </p>
        </div>
        <TaskList />
      </div>
    </main>
  );
} 