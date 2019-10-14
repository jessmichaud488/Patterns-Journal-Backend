'use strict'; 
//const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
var cors = require('cors');

//const appRouter = require('./routers/AppRouter');
const entryRouter = require('./src/routers/entryRouter');
const userRouter = require('./src/routers/userRouter');
const { router: authRouter, localStrategy, jwtStrategy } = require('./src/auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const app = express();

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(morgan('common'));
app.use(cors());

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//app.use('/AppRouter', appRouter);
app.use('/entryRouter', entryRouter);
app.use('/userRouter', userRouter);
app.use('/auth', authRouter);

// A protected endpoint which needs a valid JWT to access it
/*app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});*/

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;



function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.set('debug', true);
    mongoose.set('useFindAndModify', false);
    mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
