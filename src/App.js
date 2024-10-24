import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // Fetch tasks from the backend
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    };

    const addTask = async () => {
        if (!newTask) return;
        const response = await axios.post('http://localhost:5000/tasks', { title: newTask });
        setTasks([...tasks, response.data]);
        setNewTask('');
    };

    const toggleTask = async (id, completed) => {
        const response = await axios.put(`http://localhost:5000/tasks/${id}`, { completed });
        setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <div className="task-input">
                <input 
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id} className={task.completed ? 'completed' : ''}>
                        <span onClick={() => toggleTask(task._id, !task.completed)}>
                            {task.title}
                        </span>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
