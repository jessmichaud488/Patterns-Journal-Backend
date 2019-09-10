'use strict';
const {router} = require('../src/routers/AppRouter.js');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy};
