const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');


//use ES6 promises
mongoose.Promise = global.Promise;


const {User} = require('../schemas/userSchema');
const internalMsg = 'Internal server error occured.';

//user profiles whether with queries or none
router.get('/', (req,res)=>{
	//store the values of the queries
  const active = req.query.active;
	const verified = req.query.verified;
	let userPromise;
	//if both queries are undefined, get all the users
	if(typeof(active) === "undefined" && typeof(verified) === "undefined"){
		userPromise = User.find();
	}
	//if we have values for BOTH queries and they are strings
	else if(typeof(active) === "string" && typeof(verified) === "string"){
		//check to see if it's our expected values for both query
		if((active === "true" || active === "false") && (verified === "true" || verified === "false")){
			userPromise = User.find({isActive: active, verified: verified});
		}
		else{
			const message = `Query values ${active} and/or ${verified} are not expected.`;
			return res.status(400).send(message);
		}
	}
	//if only one of the queries have values
	else if(typeof(active) === "string" || typeof(verified) === "string"){
		//test if active is the one with value and the values are what we expect
		if(typeof(active) === "string" && (active === "true" || active === "false")){
			userPromise = User.find({isActive: active});
		}
		//then check verified for the same condition
		else if(typeof(verified) === "string" && (verified === "true" || verified === "false")){
			userPromise = User.find({verified: verified});
		}
		else{
			const message = 'Query value unexpected.';
			return res.status(400).send(message);
		}
	}
	//proceed with the query to the db
	userPromise
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//View a single user account/profile
router.get('/:id', (req, res) => {
	User.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//create a new user profile/account
router.post('/signUp', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['username', 'password'];
	//use for loop to check if all required properties are in the req body
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body.`;
			//console error the message if at least one is missing
			console.error(message);
			//return with a 400 staus and the error message
			return res.status(400).send(message);
		}
	}
  
  return User.find({username: req.body.username})
    .countDocuments()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(req.body.password);
  })
    .then (hash => {
         return	 User.create({
		username: req.body.username,
		password: hash
	})
  })
	.then(newUser => res.status(201).json(newUser))
  .catch(err => {
	  console.log('error on Post', err);
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
});;});

//update a specific user account/profile
router.put('/:id', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['password'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
	}
	//update the database by finding the id first using the id from req
	//then set the data to update
	User.hashPassword(req.body.password)
	.then(hash => {
		User.findByIdAndUpdate(req.params.id, {$set: {password: hash}}, {upsert: true})
		.then(user=>{
			if (!user) res.status(404).send('User not found');
			return User.findById(req.params.id)
				.then(data => res.status(200).json(data));
		}
		)
		.catch(err => {
			console.log('Error =', err);
			res.status(400).send(err)
		})
	})
});

//disable a specific user profile/account by setting isActive to false
router.delete('/:id', (req,res)=>{
	User.findByIdAndRemove(req.params.id, (err, user) => {
		if (err) return res.status(500).send(err);
		const response = {
			message: "user successfully deleted",
			id: user.id
		};
		return res.status(200).send(response);
	});
});


module.exports = router;
