const cache = require('./cache')
const fs = require('fs').promises

const requestListener = async function (req, res) {
  if (req.url === '/') {
    fs.readFile('./index.html')
      .then(contents => {
        res.setHeader('Content-Type', 'text/html')
        res.writeHead(200)
        res.end(contents)
      })
      .catch(err => {
        res.writeHead(500)
        res.end(err)
        return
      })
  } else {
    if (req.url !== '/favicon.ico') {
      const response = await cache.getOrCreateCachedPage(req.url).catch(console.error)
      console.log('response: ', response)
      res.writeHead(200)
      res.end(JSON.stringify(response))
    }

  }
}

module.exports = {
  requestListener
}