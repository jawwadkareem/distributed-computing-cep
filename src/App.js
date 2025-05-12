// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState('');
//   const [loading, setLoading] = useState(true);

//   const endpoint = 'https://dc-backend-black.vercel.app/api/tasks';

//   useEffect(() => {
//     fetch(endpoint)
//       .then(res => res.json())
//       .then(data => {
//         setTasks(data);
//         setLoading(false);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   const addTask = async () => {
//     if (!title.trim()) return;
//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title })
//     });
//     const newTask = await res.json();
//     setTasks([...tasks, newTask]);
//     setTitle('');
//   };

//   const toggleTask = async (id) => {
//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id, action: 'toggle' })
//     });
//     const updatedTask = await res.json();
//     setTasks(tasks.map(task => task._id === id ? updatedTask : task));
//   };

//   const deleteTask = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;
//     await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id, action: 'delete' })
//     });
//     setTasks(tasks.filter(task => task._id !== id));
//   };

//   return (
//     <div className="container">
//       <header>
//         <h1>📝 Task Manager</h1>
//         <p>Organize your day effectively!</p>
//       </header>

//       <div className="task-form">
//         <input
//           type="text"
//           placeholder="Enter your task..."
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button onClick={addTask}>+ Add Task</button>
//       </div>

//       <div className="task-section">
//         {loading ? (
//           <div className="loader"></div>
//         ) : tasks.length === 0 ? (
//           <p className="empty">No tasks yet. Start adding!</p>
//         ) : (
//           tasks.map(task => (
//             <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
//               <div className="task-title" onClick={() => toggleTask(task._id)}>
//                 {task.title}
//               </div>
//               <div className="task-actions">
//                 <button className="complete-btn" onClick={() => toggleTask(task._id)}>
//                   {task.completed ? 'Undo' : 'Complete'}
//                 </button>
//                 <button className="delete-btn" onClick={() => deleteTask(task._id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Sidebar from './components/Sidebar';
import TaskDashboard from './components/TaskDashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ModeToggle from './components/ModeToggle';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    completed: undefined,
    search: ''
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const endpoint = 'https://dc-backend-black.vercel.app/api/tasks';
  const statsEndpoint = 'https://dc-backend-black.vercel.app/api/stats';

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ ...toast, visible: false });
    }, 3000);
  };

  const fetchTasks = async () => {
    try {
      let url = endpoint;
      
      // Add query parameters for filtering
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.completed !== undefined) queryParams.append('completed', filters.completed.toString());
      if (filters.search) queryParams.append('search', filters.search);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Failed to load tasks. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(statsEndpoint);
      if (!res.ok) throw new Error('Failed to fetch statistics');
      
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (!res.ok) throw new Error('Failed to add task');
      
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      fetchStats();
      
      showToast('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      showToast('Failed to add task. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'update', ...taskData }),
      });
      
      if (!res.ok) throw new Error('Failed to update task');
      
      const updatedTask = await res.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      fetchStats();
      
      showToast('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Failed to update task. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle' }),
      });
      
      if (!res.ok) throw new Error('Failed to toggle task');
      
      const updatedTask = await res.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      fetchStats();
    } catch (error) {
      console.error('Error toggling task:', error);
      showToast('Failed to update task status. Please try again.', 'error');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      
      if (!res.ok) throw new Error('Failed to delete task');
      
      setTasks(tasks.filter(task => task._id !== id));
      fetchStats();
      
      showToast('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete task. Please try again.', 'error');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Set appropriate filters based on view
    if (view === 'all') {
      setFilters({ ...filters, completed: undefined });
    } else if (view === 'pending') {
      setFilters({ ...filters, completed: false });
    } else if (view === 'completed') {
      setFilters({ ...filters, completed: true });
    } else if (view === 'high-priority') {
      setFilters({ ...filters, priority: 'high', completed: false });
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Sidebar 
          activeView={activeView} 
          onViewChange={handleViewChange}
          stats={stats}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="main-content">
          <div className="header">
            <button 
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1>TaskFlow</h1>
            <ModeToggle />
          </div>
          
          {activeView === 'dashboard' ? (
            <TaskDashboard stats={stats} />
          ) : (
            <>
              <TaskForm 
                onAddTask={addTask} 
                onFilterChange={handleFilterChange}
                filters={filters}
              />
              
              {loading && tasks.length === 0 ? (
                <div className="loader-container">
                  <div className="loader"></div>
                </div>
              ) : (
                <TaskList 
                  tasks={tasks} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              )}
            </>
          )}
        </main>
        
        {toast.visible && (
          <Toast message={toast.message} type={toast.type} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
