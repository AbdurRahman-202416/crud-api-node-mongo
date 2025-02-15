import axios from 'axios'

const apiCall = axios.create({
  baseURL: 'https://crud-api-node-mongo.vercel.app/',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 40000
})



export default apiCall
