import http from '@/utils/http'
export const login = () => {
  return http.post('/users/login')
}