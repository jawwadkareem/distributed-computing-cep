import React, { useState } from 'react';

const TaskList = ({ tasks, onToggle, onDelete, onUpdate }) => {
  const [editTask, setEditTask] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  
  const formatDueDate = (date) => {
    if (!date) return null;
    
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  
  const isDueDatePast = (date) => {
    if (!date) return false;
    
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  const getCategoryClass = (category) => {
    const categories = {
      work: 'category-work',
      personal: 'category-personal',
      shopping: 'category-shopping',
      health: 'category-health',
      general: 'category-general'
    };
    
    return categories[category] || categories.general;
  };
  
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };
  
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-description">Add a new task or try changing your filters</p>
      </div>
    );
  }
  
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`task-card ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-header">
            <div className="task-title-section">
              <input 
                type="checkbox" 
                className="task-checkbox"
                checked={task.completed}
                onChange={() => onToggle(task._id)}
              />
              <div>
                <div className="task-title">{task.title}</div>
                {task.category && (
                  <span className={`task-category ${getCategoryClass(task.category)}`}>
                    {task.category}
                  </span>
                )}
              </div>
            </div>
            
            <div className="task-actions">
              <button 
                className="task-menu-btn"
                onClick={() => toggleMenu(task._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              
              <div className={`task-menu ${menuOpen === task._id ? 'open' : ''}`}>
                <div 
                  className="task-menu-item"
                  onClick={() => {
                    setEditTask(task);
                    setMenuOpen(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </div>
                
                <div 
                  className="task-menu-item"
                  onClick={() => {
                    onToggle(task._id);
                    setMenuOpen(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {task.completed ? (
                      <circle cx="12" cy="12" r="10"></circle>
                    ) : (
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    )}
                    {!task.completed && <polyline points="22 4 12 14.01 9 11.01"></polyline>}
                  </svg>
                  Mark as {task.completed ? 'incomplete' : 'complete'}
                </div>
                
                <div 
                  className="task-menu-item delete"
                  onClick={() => {
                    onDelete(task._id);
                    setMenuOpen(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </div>
              </div>
            </div>
          </div>
          
          {task.description && (
            <div className="task-body">
              <p className="task-description">{task.description}</p>
            </div>
          )}
          
          <div className="task-footer">
            <div className="task-priority">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`priority-${task.priority}`}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className={`priority-${task.priority}`}>{task.priority}</span>
            </div>
            
            {task.dueDate && (
              <div className={`task-due-date ${isDueDatePast(task.dueDate) && !task.completed ? 'overdue' : ''}`}>
                {isDueDatePast(task.dueDate) && !task.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                )}
                <span>
                  {isDueDatePast(task.dueDate) && !task.completed ? 'Overdue: ' : ''}
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Edit Task Modal */}
      {editTask && (
        <div className="modal-backdrop" onClick={() => setEditTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Task</h3>
              <button className="modal-close" onClick={() => setEditTask(null)}>×</button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate(editTask._id, {
                  title: editTask.title,
                  description: editTask.description,
                  priority: editTask.priority,
                  category: editTask.category,
                  dueDate: editTask.dueDate
                });
                setEditTask(null);
              }}
            >
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">Title</label>
                  <input
                    id="edit-title"
                    type="text"
                    className="form-input"
                    value={editTask.title}
                    onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    className="form-textarea"
                    value={editTask.description || ''}
                    onChange={(e) => setEditTask({...editTask, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" htmlFor="edit-priority">Priority</label>
                    <select
                      id="edit-priority"
                      className="form-select"
                      value={editTask.priority}
                      onChange={(e) => setEditTask({...editTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label className="form-label" htmlFor="edit-category">Category</label>
                    <select
                      id="edit-category"
                      className="form-select"
                      value={editTask.category}
                      onChange={(e) => setEditTask({...editTask, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="shopping">Shopping</option>
                      <option value="health">Health</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-dueDate">Due Date (Optional)</label>
                  <input
                    id="edit-dueDate"
                    type="date"
                    className="form-input"
                    value={editTask.dueDate ? new Date(editTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditTask({
                      ...editTask, 
                      dueDate: e.target.value ? new Date(e.target.value) : null
                    })}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditTask(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
