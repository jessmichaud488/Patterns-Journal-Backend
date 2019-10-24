'use strict'
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategies');

const path = require('path')
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'))
})
module.exports = {router, localStrategy, jwtStrategy};
