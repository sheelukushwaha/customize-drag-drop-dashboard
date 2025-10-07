import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Timer from './Timer';
import useInactivity from '../hooks/useInactivity';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../App.css';

const defaultWidgets = [
  { id: 'timer', type: 'timer' },
  { id: 'userInfo', type: 'userInfo' },
  { id: 'weather', type: 'widget', content: 'Weather Widget' },
  { id: 'todo', type: 'widget', content: 'To-Do Widget' },
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { inactive, counter, resetInactivity } = useInactivity(60, logout);
  const [widgets, setWidgets] = useState([]);

  // Load saved layout or default
  useEffect(() => {
    if (!user) return;
    const savedLayout = localStorage.getItem(`dashboard-layout-${user.id}`);
    if (savedLayout) setWidgets(JSON.parse(savedLayout));
    else setWidgets(defaultWidgets);
  }, [user]);

  // Persist layout to localStorage
  useEffect(() => {
    if (user && widgets.length > 0) {
      localStorage.setItem(`dashboard-layout-${user.id}`, JSON.stringify(widgets));
    }
  }, [widgets, user]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newWidgets = Array.from(widgets);
    const [moved] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, moved);
    setWidgets(newWidgets);
  };

  const resetLayout = () => setWidgets(defaultWidgets);

  if (!user) return null; // wait until user is loaded

  return (
    <div className="dashboard-wrapper">
      <h2 className="welcome-text">Welcome, {user.firstName} {user.lastName}</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="dashboard-container">
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`dashboard-card ${snapshot.isDragging ? 'dragging' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : '0 6px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {widget.type === 'timer' ? (
                        <Timer userId={user.id} />
                      ) : widget.type === 'userInfo' ? (
                        <div className="widget">
                          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                          <p><strong>Username:</strong> {user.username}</p>
                        </div>
                      ) : (
                        <div className="widget">{widget.content}</div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="button-row">
        <button className="reset-button" onClick={resetLayout}>Reset Layout</button>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>

      {inactive && (
        <div className="inactivity-dialog">
          <p>Inactive for a while. Logging out in <strong>{counter}</strong>s</p>
          <div className="dialog-buttons">
            <button className="extend-button" onClick={resetInactivity}>Extend Session</button>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;