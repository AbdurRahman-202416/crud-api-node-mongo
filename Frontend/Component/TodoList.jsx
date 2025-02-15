import React, { useState, useEffect } from 'react'
import axios from 'axios'

const apiUrl = 'https://crud-api-node-mongo.vercel.app/api/todos'

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

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Fetch all todos from the API
  const fetchTodos = async () => {
    try {
      const response = await axios.get(apiUrl)
      if (Array.isArray(response.data.data)) {
        setTodos(response.data.data)
      } else {
        setTodos([])
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
      setTodos([])
    }
  }

  // Add new task
  const handleAddTodo = async e => {
    e.preventDefault()
    try {
      await axios.post(apiUrl, {
        text: newTodo.text,
        priority: newTodo.priority,
        deadline: newTodo.deadline,
        complete: false
      })
      fetchTodos()
      setNewTodo({ text: '', priority: 'high', deadline: '' })
    } catch (error) {
      console.error('Error adding new task:', error)
    }
  }

  // Toggle task completion status
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await axios.patch(`${apiUrl}/${id}`, { complete: !currentStatus })
      fetchTodos()
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  // Open Edit Modal
  const openEditModal = todo => {
    setCurrentTodo(todo)
    setEditModalOpen(true)
  }

  // Close Edit Modal
  const closeEditModal = () => {
    setCurrentTodo(null)
    setEditModalOpen(false)
  }

  // Update Task
  const handleUpdateTodo = async e => {
    e.preventDefault()
    try {
      await axios.patch(`${apiUrl}/${currentTodo._id}`, {
        text: currentTodo.text,
        priority: currentTodo.priority,
        deadline: currentTodo.deadline,
        complete: currentTodo.complete
      })
      fetchTodos()
      closeEditModal()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Open Delete Modal
  const openDeleteModal = todo => {
    setCurrentTodo(todo)
    setDeleteModalOpen(true)
  }

  // Close Delete Modal
  const closeDeleteModal = () => {
    setCurrentTodo(null)
    setDeleteModalOpen(false)
  }

  // Delete Task
  const handleDeleteTodo = async () => {
    try {
      await axios.delete(`${apiUrl}/${currentTodo._id}`)
      fetchTodos()
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className='bg-gray-700 text-white min-h-screen'>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='text-3xl font-semibold text-center mb-6'>Todo App</h1>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className='mb-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-1'>
            <input
              type='text'
              name='text'
              value={newTodo.text}
              onChange={e => setNewTodo({ ...newTodo, text: e.target.value })}
              placeholder='Todo Title'
              className='p-2 border border-gray-600 bg-black text-white rounded-md'
              required
            />
            <select
              required
              name='priority'
              value={newTodo.priority}
              onChange={e =>
                setNewTodo({ ...newTodo, priority: e.target.value })
              }
              className='p-2 border border-gray-600 bg-black text-white rounded-md'
            >
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>
            <input
              type='date'
              name='deadline'
              value={newTodo.deadline}
              onChange={e =>
                setNewTodo({ ...newTodo, deadline: e.target.value })
              }
              className='p-2 border border-gray-600 bg-black text-white rounded-md'
              required
            />
          </div>
          <button
            type='submit'
            className='mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md'
          >
            Add Task
          </button>
        </form>

        {/* Todo List */}
        <div>
          {todos.map(todo => (
            <div>
              <div
                key={todo._id}
                className={`flex items-center justify-between mb-4 p-4 border rounded-md ${
                  todo.complete
                    ? 'bg-green-900 border-green-700'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div>
                  <p
                    className={`${
                      todo.complete
                        ? 'line-through text-sm sm:text-2xl  text-gray-400'
                        : 'text-white text-sm sm:text-2xl'
                    }`}
                  >
                    <input
                      type='checkbox'
                      class='shrink-0 mt-0.5 mx-3 w-5 h-5 border border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
                      id='hs-vertical-checkbox-in-form'
                      checked={todo.complete}
                      onChange={() =>
                        handleToggleComplete(todo._id, todo.complete)
                      }
                    />
                    {todo.text}
                  </p>
                  <p className='text-sm ml-3 text-gray-200'>
                    Priority: {todo.priority} - {todo.deadline}
                  </p>
                </div>
                <div className='flex gap-2 flex-col sm:flex-row items-center'>
                  <button
                    onClick={() => openEditModal(todo)}
                    className='bg-yellow-500 text-white px-5 py-1 rounded-md mr-2'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(todo)}
                    className='bg-red-500 text-white px-3 py-1 rounded-md'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editModalOpen && currentTodo && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-80'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Edit Task
              </h2>
              <form onSubmit={handleUpdateTodo}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Task Description
                  </label>
                  <input
                    type='text'
                    value={currentTodo.text}
                    onChange={e =>
                      setCurrentTodo({ ...currentTodo, text: e.target.value })
                    }
                    className='w-full p-2 border border-gray-600 bg-black text-white rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Priority
                  </label>
                  <select
                    value={currentTodo.priority}
                    onChange={e =>
                      setCurrentTodo({
                        ...currentTodo,
                        priority: e.target.value
                      })
                    }
                    className='w-full p-2 border border-gray-600 bg-black text-white rounded-md'
                  >
                    <option value='high'>High</option>
                    <option value='medium'>Medium</option>
                    <option value='low'>Low</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Deadline
                  </label>
                  <input
                    type='date'
                    value={currentTodo.deadline}
                    onChange={e =>
                      setCurrentTodo({
                        ...currentTodo,
                        deadline: e.target.value
                      })
                    }
                    className='w-full p-2 border border-gray-600 bg-black text-white rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Completed
                  </label>
                  <input
                    type='checkbox'
                    checked={currentTodo.complete}
                    onChange={e =>
                      setCurrentTodo({
                        ...currentTodo,
                        complete: e.target.checked
                      })
                    }
                    className='mr-2'
                  />
                  <span>
                    {currentTodo.complete ? 'Completed' : 'Incomplete'}
                  </span>
                </div>
                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={closeEditModal}
                    className='px-4 py-2 bg-gray-700 text-white rounded-md mr-2'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-500 text-white rounded-md'
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModalOpen && currentTodo && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-80'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Delete Task
              </h2>
              <p className='mb-4 text-white'>
                Are you sure you want to delete the task:{' '}
                <strong>{currentTodo.text}</strong>?
              </p>
              <div className='flex justify-end'>
                <button
                  onClick={closeDeleteModal}
                  className='px-4 py-2 bg-gray-700 text-white rounded-md mr-2'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTodo}
                  className='px-4 py-2 bg-red-500 text-white rounded-md'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
