import http from 'node:http'

http.createServer((req, res) => {
  res.end('ok')
}).listen(8888, '127.0.0.1', () => {
  console.log('running on 8888')
})