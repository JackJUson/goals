// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import GoalForm from '@components/GoalForm';
import GoalList from '@components/GoalList';
import WeeklyTable from '@components/WeeklyTable';
import Link from 'next/link';
import Modal from '@components/Modal';

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await fetch('/api/goals');
    const data = await response.json();
    setGoals(data);
  };

  const handleCreateGoal = async (goal) => {
    if (editingGoal) {
      await fetch(`/api/goals`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goal, id: editingGoal._id }),
      });
      setEditingGoal(null);
    } else {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
    }
    fetchGoals();
  };

  const handleDeleteGoal = async (id) => {
    await fetch(`/api/goals`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchGoals();
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6 bg-background'>
      <h1 className='text-6xl font-heading font-[550] mb-4 text-primary'>iPhone 15 Pro</h1>
      <p className='w-[600px]'>
        Widgets are becoming even more powerful in even more places. Now you can use WidgetKit to
        build support for interactivity and animated transitions, so people can take action right in
        your widget. Once you rebuild for iPadOS 17, with just a few simple changes your existing
        widgets will look great in StandBy on iPhone, on the Lock Screen on iPad, and on the desktop
        on Mac. With SwiftUI, the system adapts your widget’s color and spacing based on context,
        extending its usefulness across platforms. Live Activities built with WidgetKit and
        ActivityKit are now available on iPad to help people stay on top of what’s happening in your
        app in real time, right from the Lock Screen.
      </p>
      <div className='flex space-x-4'>
        <Link href='/'>
          <button className='btn btn-outline bg-primary text-primary-foreground px-12 font-medium'>
            Home
          </button>
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className='btn btn-outline bg-primary text-primary-foreground px-12 font-medium'
        >
          Create Goal
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <GoalForm
          onCreate={handleCreateGoal}
          initialData={editingGoal}
          onClose={handleModalClose}
        />
      </Modal>
      <div className='w-full my-9 flex justify-center items-center'>
        <GoalList goals={goals} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
      </div>
      {[...Array(12)].map((_, index) => (
        <WeeklyTable key={index} weekNumber={index + 1} goals={goals} />
      ))}
    </div>
  );
}
