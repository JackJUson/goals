'use client';

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import ProgressBar from './ProgressBar'; // Adjust the import path as necessary

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const frequencyOptions = [
  { value: 'daily', label: 'Daily', days: 7 },
  { value: '6', label: '6 times', days: 6 },
  { value: '5', label: '5 times', days: 5 },
  { value: '4', label: '4 times', days: 4 },
  { value: '3', label: '3 times', days: 3 },
  { value: '2', label: '2 times', days: 2 },
  { value: '1', label: '1 time', days: 1 },
];

const WhiteCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#7f8ea3',
  '&.Mui-checked': {
    color: '#1E90FF',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20, // Adjust the font size for the checkbox
  },
}));

export default function TaskRow({ task, goals, updateTask, selectedTasks, setSelectedTasks }) {
  const [name, setName] = useState(task.name);
  const [goalId, setGoalId] = useState(task.goalId);
  const [frequency, setFrequency] = useState(task.frequency || 'daily');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [days, setDays] = useState(
    task.days || {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    }
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const selectedFrequency = frequencyOptions.find((option) => option.value === frequency);
    const completedDays = Object.values(days).filter(Boolean).length;
    const totalDays = selectedFrequency.days;
    const newProgress = totalDays
      ? Math.min(Math.round((completedDays / totalDays) * 100), 100)
      : 0;
    setProgress(newProgress);
  }, [days, frequency]);

  const handleChange = async (field, value) => {
    try {
      const updatedTask = { ...task, [field]: value };
      updateTask(updatedTask);
      await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const toggleDay = (day) => {
    const updatedDays = { ...days, [day]: !days[day] };
    setDays(updatedDays);
    handleChange('days', updatedDays);
  };

  const handleSelectTask = () => {
    if (selectedTasks.includes(task._id)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== task._id));
    } else {
      setSelectedTasks([...selectedTasks, task._id]);
    }
  };

  return (
    <tr className={`task-row ${selectedTasks.includes(task._id) ? 'selected-row' : ''}`}>
      <td className='border border-border border-l-0'>
        <div className='flex items-center'>
          <div
            className={`hidden-checkbox ${
              selectedTasks.includes(task._id) ? 'selected-checkbox' : ''
            }`}
          >
            <WhiteCheckbox
              checked={selectedTasks.includes(task._id)}
              onChange={handleSelectTask}
              inputProps={{ 'aria-label': 'Select task' }}
              sx={{
                '& .MuiTouchRipple-root': {
                  display: 'none', // Remove the ripple effect
                },
                '&:hover': {
                  backgroundColor: 'transparent', // Remove hover background
                },
                width: '28px',
              }}
            />
          </div>
          <input
            type='text'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleChange('name', e.target.value);
            }}
            className='w-full bg-background outline-none cursor-pointer focus:cursor-text focus:bg-muted-foreground'
          />
        </div>
      </td>
      <td className='border border-border px-2'>
        <select
          value={goalId}
          onChange={(e) => {
            setGoalId(e.target.value);
            handleChange('goalId', e.target.value);
          }}
          className='w-full bg-background outline-none cursor-pointer'
        >
          <option value=''>Select Goal</option>
          {goals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title}
            </option>
          ))}
        </select>
      </td>
      <td className='border border-border px-2'>
        <select
          value={frequency}
          onChange={(e) => {
            setFrequency(e.target.value);
            handleChange('frequency', e.target.value);
          }}
          className='w-full bg-background outline-none cursor-pointer'
        >
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className='border border-border px-2'>
        <input
          type='date'
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            handleChange('dueDate', e.target.value);
          }}
          className='w-full bg-background outline-none cursor-pointer'
        />
      </td>
      {daysOfWeek.map((day) => (
        <td key={day} className='border border-border'>
          <div className='flex justify-center items-center'>
            <WhiteCheckbox
              checked={days[day] || false}
              onChange={() => toggleDay(day)}
              inputProps={{ 'aria-label': day }}
            />
          </div>
        </td>
      ))}
      <td className='border border-border border-r-0'>
        <ProgressBar progress={progress} />
      </td>
    </tr>
  );
}
