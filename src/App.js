import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dc-backend-black.vercel.app/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch('https://dc-backend-black.vercel.app/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const toggleTask = async (id) => {
    const res = await fetch(`https://dc-backend-black.vercel.app/api/tasks/${id}`, { method: 'PUT' });
    const updatedTask = await res.json();
    setTasks(tasks.map(task => task._id === id ? updatedTask : task));
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await fetch(`https://dc-backend-black.vercel.app/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <div className="container">
      <header>
        <h1>📝 Task Manager</h1>
        <p>Organize your day effectively!</p>
      </header>

      <div className="task-form">
        <input
          type="text"
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask}>+ Add Task</button>
      </div>

      <div className="task-section">
        {loading ? (
          <div className="loader"></div>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Start adding!</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-title" onClick={() => toggleTask(task._id)}>
                {task.title}
              </div>
              <div className="task-actions">
                <button className="complete-btn" onClick={() => toggleTask(task._id)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

