'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 

const config = require('../../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.userName,
    expiresIn: 3000, //config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});  
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  let user = req.user.serialize();
  let userId = user.id.toString();
  const authToken = createAuthToken(user);
  res.json({authToken, userId: userId});
});

router.post('/signUp', localAuth, (req, res) => {
  let user = req.user.serialize();
  let userId = user.id.toString();
  res.json({authToken, userId: userId});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};

