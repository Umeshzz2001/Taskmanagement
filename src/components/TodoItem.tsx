import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  return (
    <div 
      ref={itemRef}
      className={`group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 ${
        isDeleting ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
      } ${todo.completed ? 'opacity-75' : ''}`}
    >
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
          todo.completed 
            ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <Check className="w-3 h-3 m-0.5 transition-all duration-200" strokeWidth={3} />
        )}
      </button>

      <span 
        className={`flex-1 text-gray-800 dark:text-gray-200 transition-all duration-200 ${
          todo.completed 
            ? 'line-through text-gray-500 dark:text-gray-400' 
            : ''
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}