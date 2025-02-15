import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Database/db.js'
import TODO from './models/todo.models.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 4000

// middleware
app.use(cors()) 
app.use(express.json())

connectDB()

// Todo API's
app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 80%;
            max-width: 600px;
          }
          h1 {
            color: #4CAF50;
            font-size: 48px;
            margin-bottom: 20px;
          }
          p {
            color: #333;
            font-size: 18px;
          }
          .success-message {
            color: #4CAF50;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Todos API</h1>
          <p class="success-message">Server is running successfully!</p>
        </div>
      </body>
    </html>
  `)
})

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await TODO.find()
    res.send({
      success: true,
      message: 'Data fetched successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Data fetch failed',
      error: error.message
    })
  }
})

// POST a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const todoDetails = req.body
    const result = await TODO.create(todoDetails)
    res.send({
      success: true,
      message: 'Todo added successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Todo add failed',
      error: error.message // Removed 'data: result' to avoid undefined variable
    })
  }
})

// GET a specific todo by ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await TODO.findById(id)
    res.send({
      success: true,
      message: 'Todo fetched successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Todo fetch failed',
      error: error.message
    })
  }
})

// PATCH (update) a todo by ID
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todoDetails = req.body
    const result = await TODO.findByIdAndUpdate(id, todoDetails, { new: true })
    res.send({
      success: true,
      message: 'Todo updated successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Todo update failed',
      error: error.message
    })
  }
})

// DELETE a todo by ID
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await TODO.findByIdAndDelete(id)
    res.send({
      success: true,
      message: 'Todo deleted successfully',
      data: null
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Todo delete failed',
      error: error.message,
      data: null
    })
  }
})

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
