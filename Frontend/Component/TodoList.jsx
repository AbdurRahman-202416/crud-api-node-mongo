import React, { useState, useEffect } from 'react'
import apiCall from '../Axios'
import { notifyError, notifySuccess } from './Toster'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState({
    text: '',
    priority: 'high',
    deadline: ''
  })
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentTodo, setCurrentTodo] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await apiCall.get('/api/todos')
      setTodos(Array.isArray(response.data.data) ? response.data.data : [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setTodos([])
    }
  }

  const handleAddTodo = async e => {
    e.preventDefault()
    try {
      await apiCall.post('/api/todos', { ...newTodo, complete: false })
      notifySuccess('Task added successfully')
      fetchTodos()
      setNewTodo({ text: '', priority: 'high', deadline: '' })
    } catch (error) {
      console.error('Error adding new task:', error)
    }
  }

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await apiCall.patch(`/api/todos/${id}`, { complete: !currentStatus })
      fetchTodos()
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const handleEditTodo = async () => {
    try {
      setEditModalOpen(false)
      await apiCall.patch(`/api/todos/${currentTodo._id}`, {
        text: currentTodo.text,
        priority: currentTodo.priority,
        deadline: currentTodo.deadline
      })
      notifySuccess('Task updated successfully')
      fetchTodos()
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  const handleDeleteTodo = async () => {
    try {
      await apiCall.delete(`/api/todos/${currentTodo._id}`)
      notifySuccess('Task deleted successfully')
      fetchTodos()
      setDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className='bg-gray-950 text-white min-h-screen font-sans'>
      <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <header className='relative py-8 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-b-3xl shadow-lg'>
          <h1 className='text-4xl sm:text-5xl font-bold text-center text-white mb-6'>
            Todo App
          </h1>
          <form onSubmit={handleAddTodo} className='max-w-md mx-auto space-y-4'>
            <input
              type='text'
              value={newTodo.text}
              onChange={e => setNewTodo({ ...newTodo, text: e.target.value })}
              placeholder='Enter Task Title'
              className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
              required
            />
            <select
              value={newTodo.priority}
              onChange={e =>
                setNewTodo({ ...newTodo, priority: e.target.value })
              }
              className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
            >
              <option value='high'>High Priority</option>
              <option value='medium'>Medium Priority</option>
              <option value='low'>Low Priority</option>
            </select>
            <input
              type='date'
              value={newTodo.deadline}
              onChange={e =>
                setNewTodo({ ...newTodo, deadline: e.target.value })
              }
              className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
              required
            />
            <button
              type='submit'
              className='w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all'
            >
              Add Task
            </button>
          </form>
        </header>

        {/* Todo List */}
        <section className='mt-8 space-y-4'>
          {todos.map(todo => (
            <div
              key={todo._id}
              className={`p-4 rounded-lg shadow-md transition-shadow ${
                todo.complete
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-gray-800/20 border-gray-700'
              }`}
            >
              <div className='flex items-center justify-between'>
                {/* Task Details */}
                <div className='flex items-center gap-4 w-full'>
                  <input
                    type='checkbox'
                    className='hidden peer'
                    checked={todo.complete}
                    onChange={() =>
                      handleToggleComplete(todo._id, todo.complete)
                    }
                    id={`checkbox-${todo._id}`}
                  />
                  <label
                    htmlFor={`checkbox-${todo._id}`}
                    className='w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer peer-checked:bg-green-500 peer-checked:border-green-500 transition-all'
                  >
                    ✓
                  </label>
                  <div className='w-full'>
                    <p
                      className={`text-base sm:text-lg font-medium ${
                        todo.complete
                          ? 'line-through text-gray-400'
                          : 'text-white'
                      }`}
                      title={todo.text}
                    >
                      {todo.text.length > 30
                        ? `${todo.text.substring(0, 30)}...`
                        : todo.text}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                      🔥 Priority: {todo.priority} | 🗓 Deadline: {todo.deadline}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setCurrentTodo(todo)
                      setEditModalOpen(true)
                    }}
                    className='p-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all'
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTodo(todo)
                      setDeleteModalOpen(true)
                    }}
                    className='p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all'
                  >
                     Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Edit Modal */}
      {editModalOpen && currentTodo && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-gray-800 p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-4'>Edit Todo</h2>
            <input
              type='text'
              value={currentTodo.text}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, text: e.target.value })
              }
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-indigo-500 transition-colors'
            />
            <select
              value={currentTodo.priority}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, priority: e.target.value })
              }
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-indigo-500 transition-colors'
            >
              <option value='high'>High Priority</option>
              <option value='medium'>Medium Priority</option>
              <option value='low'>Low Priority</option>
            </select>
            <input
              type='date'
              value={currentTodo.deadline}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, deadline: e.target.value })
              }
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-indigo-500 transition-colors'
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={handleEditTodo}
                className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all'
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && currentTodo && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-gray-800 p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-4'>Delete Todo</h2>
            <p className='mb-4'>
              Are you sure you want to delete this task?
              <br />
              <strong>{currentTodo.text}</strong>
            </p>
            <div className='flex justify-end gap-2'>
              <button
                onClick={handleDeleteTodo}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all'
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList
