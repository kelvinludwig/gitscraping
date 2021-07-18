const http = require('http')
const server = require('./server')

//Start the HTTP service listening in port 8080
console.log('Running service...')
const sv = http.createServer(server.requestListener)
sv.listen(process.env.PORT || 8080)
