const cache = require('./cache')
const fs = require('fs').promises


/**
 * Returns the response to a request received
 * @param {*} req 
 * @param {*} res 
 */
const requestListener = async (req, res) => {
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
      try {
        const response = await cache.getOrCreateCachedPage(req.url)
        console.log('response: ', response)
        res.writeHead(200)
        res.end(JSON.stringify(response))
      } catch (error) {
        console.log('25', error)
        if (error.msg == 'project not found') {
          res.writeHead(404)
        } else {
          res.writeHead(400)
        }
        res.end(JSON.stringify(error) || null)
      }
    }
  }
}

module.exports = {
  requestListener
}