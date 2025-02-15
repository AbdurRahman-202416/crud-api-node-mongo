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
    <div className='bg-gray-800 text-white overflow-hidden'>
      <div className='max-w-[100%] sm:max-w-[95%] mx-auto'>
        {/* Header and form */}
        <div
          className='fixed top-0 left-0 w-full p-4 z-50 shadow-lg bg-gray-900 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://st4.depositphotos.com/34793116/40976/i/450/depositphotos_409763232-stock-photo-abstract-colorful-texture-background-copy.jpg')"
          }}
        >
          <h1 className='text-3xl font-semibold text-center mb-4 text-white'>
            Todo App
          </h1>
          <form onSubmit={handleAddTodo} className='max-w-md mx-auto'>
            <div className='grid gap-4'>
              <input
                type='text'
                value={newTodo.text}
                onChange={e => setNewTodo({ ...newTodo, text: e.target.value })}
                placeholder='Todo Title'
                className='p-2 border border-gray-600 bg-black text-white rounded-md'
                required
              />
              <select
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
                value={newTodo.deadline}
                onChange={e =>
                  setNewTodo({ ...newTodo, deadline: e.target.value })
                }
                className='p-2 border border-gray-600 bg-gray-200 text-black rounded-md'
                required
              />
            </div>
            <button
              type='submit'
              className='mt-4 w-full px-4 py-2 bg-indigo-800 text-white rounded-md'
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className='mt-[76%] sm:mt-[21%] py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent h-auto'>
          {todos.map(todo => (
            <div key={todo._id}>
              <p className='text-xs px-2 sm:text-sm text-gray-300'>
                🔥 Priority:{' '}
                <span className='font-semibold'>{todo.priority}</span> | 🗓
                Deadline: {todo.deadline}
              </p>
              <div
                className={`flex items-center justify-between m-2 sm:p-2  rounded-lg shadow-lg shadow-gray-700 backdrop-blur-lg bg-opacity-30 border border-gray-600 ${
                  todo.complete
                    ? 'bg-green-800/40 border-green-500'
                    : 'bg-gray-800/40 border-gray-500'
                }`}
              >
                <div className='flex items-center gap-3 w-full'>
                  {/* Custom Checkbox */}
                  <input
                    type='checkbox'
                    className='peer hidden'
                    checked={todo.complete}
                    onChange={() =>
                      handleToggleComplete(todo._id, todo.complete)
                    }
                    id={`checkbox-${todo._id}`}
                  />
                  <label
                    htmlFor={`checkbox-${todo._id}`}
                    className='w-6 h-6 flex items-center justify-center border-2 border-gray-300 rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:border-green-600 transition-all'
                  >
                    ✓
                  </label>

                  <div className='w-full'>
                    <p
                      className={`text-base sm:text-xl font-medium ${
                        todo.complete
                          ? 'line-through text-gray-400'
                          : 'text-white'
                      }`}
                      title={todo.text} // Tooltip will show the full text on hover
                    >
                      {todo.text.length > 15
                        ? `${todo.text.substring(0, 32)}...`
                        : todo.text}
                    </p>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className='flex flex-col sm:flex-row gap-2 items-center'>
                  <button
                    onClick={() => {
                      setCurrentTodo(todo)
                      setEditModalOpen(true)
                    }}
                    className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg shadow-md transition-all text-xs sm:text-base'
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTodo(todo)
                      setDeleteModalOpen(true)
                    }}
                    className='bg-red-700 hover:bg-red-500 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg shadow-md transition-all text-xs sm:text-base'
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Todo Modal */}
      {editModalOpen && currentTodo && (
        <div className='fixed inset-0 flex  items-center justify-center bg-transparent bg-opacity-50 z-50'>
          <div className=' bg-gray-600 p-6 grid grid-rows-1 rounded-lg w-11/12 sm:w-1/3'>
            <h2 className='text-xl font-semibold'>Edit Todo</h2>
            <input
              type='text'
              value={currentTodo.text}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, text: e.target.value })
              }
              className='p-2 border border-gray-600 bg-black text-white rounded-md mb-4'
            />
            <select
              value={currentTodo.priority}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, priority: e.target.value })
              }
              className='p-2 border border-gray-600 bg-black text-white rounded-md mb-4'
            >
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>
            <input
              type='date'
              value={currentTodo.deadline}
              onChange={e =>
                setCurrentTodo({ ...currentTodo, deadline: e.target.value })
              }
              className='p-2 border border-gray-600 bg-gray-200 text-black rounded-md mb-4'
            />
            <button
              onClick={handleEditTodo}
              className='w-full px-4 py-2 bg-blue-600 text-white rounded-md'
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              className='mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded-md'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Todo Modal */}
      {deleteModalOpen && currentTodo && (
        <div className='fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50'>
          <div className='p-6 bg-black rounded-lg w-11/12 sm:w-1/3'>
            <h2 className='text-xl font-semibold'>Delete Todo</h2>
            <p>Are you sure you want to delete this todo item?</p>
            <p>
              <strong>{currentTodo.text}</strong>
            </p>
            <button
              onClick={handleDeleteTodo}
              className='mt-4 w-full px-4 py-2 bg-red-700 text-white rounded-md'
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className='mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded-md'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList
