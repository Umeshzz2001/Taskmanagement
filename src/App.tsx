import React, { useState, useRef, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, List } from 'lucide-react';
import { TodoItem } from './components/TodoItem';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Todo, FilterType } from './types/todo';

function TodoApp() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([newTodo, ...todos]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <List className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                TaskFlow
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Stay organized, stay productive
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-4 pr-12 text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:dark:bg-gray-600 flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{activeTodos.length}</span> active
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedTodos.length}</span> completed
                </span>
              </div>
              {completedTodos.length > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
                >
                  Clear completed
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <div className="mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    filter === filterType
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {filterType}
                  {filterType === 'active' && activeTodos.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      {activeTodos.length}
                    </span>
                  )}
                  {filterType === 'completed' && completedTodos.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full text-xs">
                      {completedTodos.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              {todos.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">
                  <Circle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No tasks yet</p>
                  <p className="text-sm">Add your first task above to get started!</p>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No {filter} tasks</p>
                  <p className="text-sm">
                    {filter === 'active' && 'All tasks are completed! 🎉'}
                    {filter === 'completed' && 'No completed tasks yet.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-in slide-in-from-top-2 fade-in duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Double-click to edit • Enter to save • Escape to cancel</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TodoApp />
    </ThemeProvider>
  );
}

export default App;