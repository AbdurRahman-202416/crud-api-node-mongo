import mongoose from 'mongoose'
const connectDB = async () => {
  await mongoose.connect(process.env.URI).then(res => {
    console.log('MongoDB Database connected')
  })
}
export default connectDB
