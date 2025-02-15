import express from 'express'
import dotenv from 'dotenv'
import connectDB from './Database/db.js'
import TODO from './models/todo.models.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

// middleware
app.use(express.json())
connectDB()

//todo Api's
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

app.get('/api/todos', async (req, res) => {
  try {
    const result = await TODO.find()
    res.send({
      success: true,
      massage: 'Data fetch successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      massage: 'Data fetch failed',
      error: error.message
    })
  }
})

app.post('/api/todos', async (req, res) => {
  try {
    const todoDetails = req.body
    const result = await TODO.create(todoDetails)
    res.send({
      success: true,
      massage: 'Todo added successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      massage: 'Todo added failed',
      error: error.message,
      data: result
    })
  }
})

app.get('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await TODO.findById(id)
    res.send({
      success: true,
      massage: 'Todo fetch successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      massage: 'Todo fetch failed',
      error: error.message
    })
  }
})

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todoDetails = req.body
    const result = await TODO.findByIdAndUpdate(id, todoDetails)
    res.send({
      success: true,
      massage: 'Todo updated successfully',
      data: result
    })
  } catch (error) {
    res.send({
      success: false,
      massage: 'Todo updated failed',
      error: error.message
    })
  }
})

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await TODO.findByIdAndDelete(id)
    res.send({
      success: true,
      massage: 'Todo deleted successfully',
      data: null
    })
  } catch (error) {
    res.send({
      success: false,
      massage: 'Todo deleted failed',
      error: error.message,
      data: null
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
