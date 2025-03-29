import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://todo-gray-omega-66.vercel.app';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos
  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Add todo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTodo,
        completed: false
      }),
    })
      .then(response => response.json())
      .then(data => {
        setTodos([...todos, data]);
        setNewTodo('');
      })
      .catch(error => console.error('Error:', error));
  };

  // Toggle todo
  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed
      }),
    })
      .then(response => response.json())
      .then(() => {
        setTodos(todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      })
      .catch(error => console.error('Error:', error));
  };

  // Delete todo
  const deleteTodo = (id) => {
    fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(todos.filter(t => t.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span 
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
            >
              {todo.title}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
