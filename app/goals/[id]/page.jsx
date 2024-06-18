'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoalForm from '@components/GoalForm';
import TaskForm from '@components/TaskForm';
import TaskList from '@components/TaskList';
import Modal from '@components/Modal';

export default function GoalDetailPage({ params }) {
  const { id } = params;
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGoal();
    fetchTasks();
  }, []);

  const fetchGoal = async () => {
    const response = await fetch(`/api/goals/${id}`);
    const data = await response.json();
    setGoal(data);
  };

  const fetchTasks = async () => {
    const response = await fetch(`/api/tasks?goalId=${id}`);
    const data = await response.json();
    setTasks(data);
  };

  const handleEditGoal = async (updatedGoal) => {
    await fetch(`/api/goals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updatedGoal, id: goal._id }),
    });
    fetchGoal();
    setIsEditModalOpen(false);
  };

  const handleDeleteGoal = async () => {
    await fetch(`/api/goals`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: goal._id }),
    });
    router.push('/dashboard');
  };

  const handleCreateTask = async (task) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    fetchTasks();
    setIsTaskModalOpen(false);
  };

  if (!goal) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6 bg-background'>
      <h1 className='text-6xl font-heading mb-4 text-primary'>{goal.title}</h1>
      <p className='text-lg'>{goal.description}</p>
      <p>Timeframe: {goal.timeframe}</p>
      <p>Status: {goal.status}</p>
      <div className='flex space-x-4 my-4'>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className='btn btn-outline bg-primary text-primary-foreground'
        >
          Edit Goal
        </button>
        <button
          onClick={handleDeleteGoal}
          className='btn btn-outline bg-error text-error-foreground'
        >
          Delete Goal
        </button>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className='btn btn-outline bg-primary text-primary-foreground'
        >
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} />
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <GoalForm
          onCreate={handleEditGoal}
          initialData={goal}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <TaskForm goalId={goal._id} onCreate={handleCreateTask} />
      </Modal>
    </div>
  );
}
