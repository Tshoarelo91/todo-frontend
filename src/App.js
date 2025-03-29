import React, { useState, useEffect } from 'react';
import ProgressChart from './components/ProgressChart';
import './App.css';

const API_URL = 'https://todo-r7tk.onrender.com';

const STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

const STATUSES_LIST = [STATUSES.PENDING, STATUSES.IN_PROGRESS, STATUSES.COMPLETED];

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(STATUSES.PENDING);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');

  // Fetch todos and categories
  useEffect(() => {
    Promise.all([
      fetchTodos(),
      fetchCategories()
    ]);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      setCategory(data[0]); // Set default category to first option
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set default categories if API fails
      const defaultCategories = ['personal', 'consulting', 'work'];
      setCategories(defaultCategories);
      setCategory(defaultCategories[0]);
    }
  };

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
          status: STATUSES.PENDING,
          due_date: dueDate || null,
          category: category
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add todo');
      }

      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
      setDueDate('');
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

  // Update todo category
  const updateTodoCategory = async (id, newCategory) => {
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
          category: newCategory
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

  // Update todo due date
  const updateTodoDueDate = async (id, newDueDate) => {
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
          due_date: newDueDate || null
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter todos by status and category
  const filteredTodos = todos.filter(todo => {
    const statusMatch = activeStatus === 'all' || todo.status === activeStatus;
    const categoryMatch = activeCategory === 'all' || todo.category === activeCategory;
    return statusMatch && categoryMatch;
  });

  const renderTodoItem = (todo) => {
    return (
      <div key={todo.id} className="todo-item">
        <p className="todo-text">{todo.title}</p>
        <select
          className="status-select"
          value={todo.status}
          onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
        >
          {STATUSES_LIST.map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          className="category-select"
          value={todo.category || ''}
          onChange={(e) => updateTodoCategory(todo.id, e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          className="date-input"
          value={todo.due_date || ''}
          onChange={(e) => updateTodoDueDate(todo.id, e.target.value)}
        />
        <button
          className="delete-button"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    );
  };

  const renderCategoryTabs = () => (
    <div className="filters">
      <div className="category-tabs">
        <button
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>To Do List</h1>
      
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
          <span className="dismiss">(click to dismiss)</span>
        </div>
      )}

      {renderCategoryTabs()}

      <div className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
        />
        <button onClick={handleSubmit} className="add-button">
          Add Todo
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeStatus === 'all' ? 'active' : ''}`}
          onClick={() => setActiveStatus('all')}
        >
          All
        </button>
        {Object.values(STATUSES).map((status) => (
          <button
            key={status}
            className={`tab ${activeStatus === status ? 'active' : ''}`}
            onClick={() => setActiveStatus(status)}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <p className="no-todos">
          No todos {activeStatus !== 'all' ? `in ${activeStatus} status` : ''}
          {activeCategory !== 'all' ? ` in ${activeCategory} category` : ''}
        </p>
      ) : (
        <div className="todo-list">
          {filteredTodos.map(todo => renderTodoItem(todo))}
        </div>
      )}
    </div>
  );
}

export default App;
