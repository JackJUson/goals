// components/GoalForm.jsx
'use client';

import { useState, useEffect } from 'react';

export default function GoalForm({ onCreate, initialData = {}, onClose }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 84); // 12 weeks
    await onCreate({ title, description, timeframe: '12-weeks', dueDate });
    setTitle('');
    setDescription('');
    onClose(); // Close the modal after submission
  };

  return (
    <form onSubmit={handleSubmit} className='form-control'>
      <h2 className='text-2xl font-bold text-primary text-center mb-2'>What is your Goal?</h2>
      <input
        type='text'
        placeholder='Goal Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='input input-bordered mb-2 text-sm'
        required
      />
      <textarea
        placeholder='Goal Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='textarea textarea-bordered mb-2 text-sm'
      />
      <button
        type='submit'
        className='btn btn-outline bg-primary text-primary-foreground px-12 mt-2 font-medium'
      >
        {initialData?.title ? 'Update Goal' : 'Create Goal'}
      </button>
    </form>
  );
}
