// ProgressBar.jsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className='flex justify-center gap-2 items-center ml-2'>
      <div className='flex justify-end w-[32px]'>
        <span className='text-[14px]'>{progress}%</span>
      </div>
      <div style={{ width: '20px', height: '20px' }}>
        <CircularProgressbar
          value={progress}
          styles={buildStyles({
            pathColor: 'rgba(34, 197, 94, 1)',
            trailColor: 'rgba(34, 60, 94, 0.3)',
          })}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
