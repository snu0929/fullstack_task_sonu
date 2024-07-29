import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './TodoList.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const socket = io('http://localhost:4000');

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('taskListUpdated', (updatedTasks: string[]) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('taskListUpdated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/fetchAllTasks');
      const items = response.data.map((item: { item: string }) => item.item);
      setTasks(items);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (newTask.trim() !== '') {
      socket.emit('add', newTask);
      setNewTask('');
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h1><i className="fas fa-sticky-note"></i> Note App</h1>
        <div className='input-btn-wraper'>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New Note..."
          />
          <button onClick={addTask}><span className='icon'>+</span> Add </button>
        </div>
        <p style={{fontWeight:"bold"}}>Notes</p>
        <ul className="tasks-list">
      
          { tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
