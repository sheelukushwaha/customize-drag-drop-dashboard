import React from 'react';
import PropTypes from 'prop-types';
import usePersistentTimer from '../hooks/usePersistentTimer';
import '../App.css';

const Timer = ({ userId }) => {
  const { seconds, reset } = usePersistentTimer(`persistent-timer-${userId}`);

  // Format seconds into HH:MM:SS
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="app-container">
      <h1 className="timer-title">Persistent Timer</h1>
      <span className="timer-value">{formatTime(seconds)}</span>
      <button className="reset-button" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

// PropTypes validation
Timer.propTypes = {
  userId: PropTypes.node.isRequired,
};

export default Timer;