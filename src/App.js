import React, { useState, useEffect } from 'react';
import ProgressChart from './components/ProgressChart';
import './App.css';

const API_URL = 'https://todo-r7tk.onrender.com';

const STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(STATUSES.PENDING);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/todos`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          status: STATUSES.PENDING
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add todo');
      }

      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (err) {
      setError(err.message || 'Failed to add todo. Please try again.');
      console.error('Error:', err);
    }
  };

  // Update todo status
  const updateTodoStatus = async (id, newStatus) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }

      const data = await response.json();
      setTodos(todos.map(t => t.id === id ? data : t));
    } catch (err) {
      setError(err.message || 'Failed to update todo. Please try again.');
      console.error('Error:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete todo');
      }

      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete todo. Please try again.');
      console.error('Error:', err);
    }
  };

  // Filter todos by status
  const filteredTodos = todos.filter(todo => todo.status === activeTab);

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
          <span className="dismiss">(click to dismiss)</span>
        </div>
      )}

      <div className="dashboard">
        <div className="chart-section">
          <h2>Progress Overview</h2>
          <ProgressChart todos={todos} />
        </div>
        
        <table className="stats-table">
          <thead>
            <tr>
              <th>Total Tasks</th>
              <th>Pending</th>
              <th>In Progress</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{todos.length}</td>
              <td>{todos.filter(t => t.status === STATUSES.PENDING).length}</td>
              <td>{todos.filter(t => t.status === STATUSES.IN_PROGRESS).length}</td>
              <td>{todos.filter(t => t.status === STATUSES.COMPLETED).length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
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

      <div className="tabs">
        <button 
          className={`tab ${activeTab === STATUSES.PENDING ? 'active' : ''}`}
          onClick={() => setActiveTab(STATUSES.PENDING)}
        >
          Pending
        </button>
        <button 
          className={`tab ${activeTab === STATUSES.IN_PROGRESS ? 'active' : ''}`}
          onClick={() => setActiveTab(STATUSES.IN_PROGRESS)}
        >
          In Progress
        </button>
        <button 
          className={`tab ${activeTab === STATUSES.COMPLETED ? 'active' : ''}`}
          onClick={() => setActiveTab(STATUSES.COMPLETED)}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty-message">No {activeTab.replace('_', ' ')} todos</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="todo-item">
              <select
                value={todo.status}
                onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
                className="status-select"
              >
                <option value={STATUSES.PENDING}>Pending</option>
                <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                <option value={STATUSES.COMPLETED}>Completed</option>
              </select>
              <span className="todo-text">
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
      )}
    </div>
  );
}

export default App;
