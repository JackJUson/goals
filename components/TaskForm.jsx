'use client';

import { useState } from 'react';

export default function TaskForm({ goalId, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate({ goalId, title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className='form-control'>
      <input
        type='text'
        placeholder='Task Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='input input-bordered'
        required
      />
      <input
        type='text'
        placeholder='Task Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='input input-bordered mt-2'
      />
      <input
        type='date'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className='input input-bordered mt-2'
        required
      />
      <button type='submit' className='btn btn-primary mt-2'>
        Create Task
      </button>
    </form>
  );
}
