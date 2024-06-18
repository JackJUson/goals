'use client';

import { useState, useEffect } from 'react';
import TaskRow from './TaskRow';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WhiteCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#7f8ea3',
  '&.Mui-checked': {
    color: '#1E90FF',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20, // Adjust the font size for the checkbox
  },
}));

export default function WeeklyTable({ weekNumber, goals }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [goals]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `/api/tasks?goalId=${goals.map((goal) => goal._id).join(',')}&weekNumber=${weekNumber}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  const handleSaveTask = async (updatedTask) => {
    const response = await fetch(`/api/tasks/${updatedTask._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === data._id ? data : task)));
    } else {
      console.error('Failed to update task:', response.statusText);
    }
  };

  const handleAddTask = async () => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        goalId: '',
        frequency: 'daily',
        dueDate: '',
        days: {
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false,
          Sat: false,
          Sun: false,
        },
        weekNumber,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
    } else {
      console.error('Failed to create task:', response.statusText);
    }
  };

  const handleDeleteTasks = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
          })
        )
      );
      setTasks(tasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
    } catch (error) {
      console.error('Failed to delete tasks:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedTasks.length > 0) {
        handleDeleteTasks();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTasks]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task._id));
    }
  };

  return (
    <div className='my-6'>
      <div className='w-[1000px] flex justify-between items-center'>
        <div className='flex mb-4'>
          <button
            onClick={toggleVisibility}
            className='text-[14px] w-[34px] h-[34px] flex justify-center items-center hover:bg-muted ease-in-out duration-300 rounded-sm'
          >
            <span
              className={`text-center transform transition-transform duration-300 ease-in-out ${
                isVisible ? 'rotate-90' : 'rotate-0'
              }`}
            >
              &#9654;
            </span>
          </button>
          <h2 className='text-[16px] font-bold pl-1'>Week {weekNumber}</h2>
        </div>
      </div>
      {isVisible && (
        <table className='w-[1000px] rounded-lg text-[14px]'>
          <thead>
            <tr>
              <th className='py-2 text-left flex'>
                <div
                  className={`hidden-checkbox ${
                    selectedTasks.length > 0 ? 'selected-checkbox' : ''
                  }`}
                >
                  <WhiteCheckbox
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                    indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'Select all tasks' }}
                    sx={{
                      '& .MuiTouchRipple-root': {
                        display: 'none', // Remove the ripple effect
                      },
                      '&:hover': {
                        backgroundColor: 'transparent', // Remove hover background
                      },
                      width: '28px',
                      height: '20px',
                    }}
                  />
                </div>
                Name
              </th>
              <th className='px-2 py-2 text-left'>Goal</th>
              <th className='px-2 py-2 text-left'>Frequency</th>
              <th className='px-4 py-2 text-left'>Due Date</th>
              {daysOfWeek.map((day) => (
                <th key={day} className='px-2 py-2'>
                  {day}
                </th>
              ))}
              <th className='px-2 py-2 text-center w-[100px]'>Progress</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                goals={goals}
                updateTask={handleSaveTask}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
              />
            ))}
            <tr>
              <td
                colSpan={daysOfWeek.length + 5}
                className='border border-border border-l-0 border-r-0 cursor-pointer'
                onClick={handleAddTask}
              >
                <div className='flex items-center'>
                  <div className='flex justify-center items-center w-[28px] h-[40px]'>
                    <AddIcon sx={{ fontSize: 20 }} />
                  </div>
                  New
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
