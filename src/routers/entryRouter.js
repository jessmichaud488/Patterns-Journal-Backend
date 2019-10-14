const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Entry} = require('../schemas/entrySchema');
const internalMsg = 'Internal server error occured.';

//view multiple entries whether there is query or not
router.get('/', (req,res)=>{
	console.log('made it!');
	Entry.find()
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//View entries by id
router.get('/:id', (req, res) => {
	console.log('find get by id');
	Entry.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//View entries by mood(entryType)
router.get('/entryType/:entryType', (req, res) => {
	console.log('find by entry type');
	Entry.find({entryType: req.params.entryType})
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//Post new entry
router.post('/', (req, res)=>{
	const requiredFields = ['title', 'entry', 'date', 'entryType'];
		for(let i=0; i < requiredFields.length; i++){
    		const field = requiredFields[i];
    		if(!(field in req.body)){
    			const message = `Missing ${field} in request body.`;
				console.error(message);
				return res.send(message);
    		}
    	}
    //check entry collection first
	Entry.findOne({title: req.body.title})
	.countDocuments()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same entry
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Entry already exists',
          location: 'entry'
        });
      }
		return Entry.create({
		   title: req.body.title,
		   entry: req.body.entry,
		   date: req.body.date,
		   entryType: req.body.entryType,
		   hoursSlept: req.body.hoursSlept,
		   createdAt: req.body.createdAt,
		   intensityLevel: req.body.intensityLevel
	   })
	})
	.then(newEntry => res.status(201).json(newEntry))
  .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
	  // error because something unexpected has happened
	  console.log('err =', err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
})
});

router.delete('/:id', (req, res) => {
	console.log('made it to delete');
	Entry.findByIdAndRemove(req.params.id, (err, entry) => {
		if (err) return res.status(500).send(err);
		const response = {
			message: "Entry successfully deleted",
			entry: entry.id
		};
		return res.status(200).send(response);
	});
});


module.exports = router
