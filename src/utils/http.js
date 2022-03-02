import axios from 'axios'

const http = axios.create({
  // baseURL: 'https://mybarberapi.herokuapp.com/api/v1'
  baseURL: 'http://apibarber.vps-kinghost.net:443/api/v1'
})

const token = window.localStorage.getItem('token')

if (token) {
  http.defaults.headers.authorization = `Bearer ${token}`
}

export default http