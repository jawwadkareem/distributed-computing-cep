import React from 'react';

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id}>
          <span 
            onClick={() => toggleTask(task._id)}
            style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
          >
            {task.title}
          </span>
          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
