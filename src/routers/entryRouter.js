const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');
const passport = require('passport');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Entry} = require('../schemas/entrySchema');
const internalMsg = 'Internal server error occured.';
const jwtAuth = passport.authenticate('jwt', { session: false });

//view multiple entries whether there is query or not
router.get('/', jwtAuth, (req,res)=>{
	console.log('made it!');
	Entry.find({_id:req.params.id, user:req.user.id})
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//View entries by id
router.get('/:id', jwtAuth, (req, res) => {
	console.log('find get by id');
	Entry.find({_id:req.params.id, user:req.user.id})
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//Post new entry
router.post('/', jwtAuth, (req, res)=>{
	console.log(req.body)
	const requiredFields = ['title', 'date', 'entry', 'sleep', 'mood', 'emotions'];
		for(let i=0; i < requiredFields.length; i++){
    		const field = requiredFields[i];
    		if(!(field in req.body)){
    			const message = `Missing ${field} in request body.`;
				console.error(message);
				return res.send(message);
    		}
    	}
    //check entry collection first
	Entry.find({title: req.body.title, _id:req.param.id, user:req.user.id})
	.countDocuments()
    .then(count => {
		console.log('fetch', count)
      if (count > 0) {
        // There is an existing user with the same entry
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Entry already exists',
          location: 'entry'
        });
	  }
	  console.log(req.user)
		return Entry.create({
		   user: req.user.id,	
		   title: req.body.title,
		   entry: req.body.entry,
		   date: req.body.date,
		   sleep: req.body.sleep,
		   mood: req.body.mood,
		   emotions: req.body.emotions
	   })
	})
	.then(newEntry => res.status(201).json(newEntry))
  .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
	  // error because something unexpected has happened
	  console.log('fetch err =', err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
})
});

router.put('/:id', jwtAuth, (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	console.log(req.param.id, req.body.id)
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['title', 'date', 'entry', 'sleep', 'mood', 'emotions'];
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
	console.log(toUpdate)
	//update the database by finding the id first using the id from req
	//then set the data to update
	Entry.update({_id:req.params.id, user:req.user.id}, {$set: {toUpdate}}
	.then((updateData)=>{
		console.log(updateData)
		return Entry.findById(req.params.id)
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

router.delete('/:id', jwtAuth, (req, res) => {
	console.log('made it to delete');
	Entry.update({_id:req.params.id, user:req.user.id}, (err, entry) => {
		if (err) return res.status(500).send(err);
		const response = {
			message: "Entry successfully deleted",
			entry: entry.id
		};
		return res.status(200).send(response);
	});
});


module.exports = router;
