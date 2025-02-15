import React, { useState, useEffect } from 'react'
import TodoList from '../Component/TodoList'
import apiCall from '../Axios'

const App = () => {
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const requestInterceptor = apiCall.interceptors.request.use(req => {
      setLoader(true)
      return req
    })

    const responseInterceptor = apiCall.interceptors.response.use(
      res => {
        setLoader(false)
        return res
      },
      err => {
        setLoader(false)
        return Promise.reject(err)
      }
    )

    // Cleanup function to remove interceptors when component unmounts
    return () => {
      apiCall.interceptors.request.eject(requestInterceptor)
      apiCall.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  return (
    <div className='relative'>
      <div className='container mx-auto'>
        {loader && (
          <div className='flex justify-center gap-2 items-center h-screen'>
            <div className='flex flex-row gap-2'>
              <div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce'></div>
              <div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]'></div>
              <div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]'></div>
            </div>
          </div>
        )}

        <TodoList />
      </div>
    </div>
  )
}

export default App
