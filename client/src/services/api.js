import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export default instance
