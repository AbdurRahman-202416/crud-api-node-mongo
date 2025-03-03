import React, { useState, useEffect } from 'react'
import TodoList from '../Component/TodoList'
import apiCall from '../Axios'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const [loader, setLoader] = useState(false)

  apiCall.interceptors.request.use(req => {
    setLoader(true)
    return req
  })

  apiCall.interceptors.response.use(
    res => {
      setLoader(false)
      return res
    },
    error => {
      setLoader(false)
      return Promise.reject(error)
    }
  )

  return (
    <div className='relative min-h-screen'>
      {/* Loader Overlay */}
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="flex gap-2 mb-3">
              <div className="w-4 sm:h-10 sm:w-10  h-4 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-4 sm:h-10 sm:w-10  h-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4  sm:h-10 sm:w-10 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
            </div>
            <p className="text-gray-700 text-sm">Loading...</p>
          </div>
        </div>
      )}

      <div className='container mx-auto relative z-10'>
        <ToastContainer />
        <TodoList />
      </div>
    </div>
  )
}

export default App