import mongoose, { model, Schema } from 'mongoose'

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, required: true },
  deadline: { type: String, required: true },
  complete: { type: Boolean, default: false }
})

const TODO = mongoose.models.todo || new model('Todo', todoSchema)

export default TODO
