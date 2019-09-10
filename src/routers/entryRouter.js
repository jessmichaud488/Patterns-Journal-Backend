const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Entry} = require('./Schemas/entrySchema');
const internalMsg = 'Internal server error occured.';

//view multiple entries whether there is query or not
router.get('/', (req,res)=>{
	const today = new Date();
	let finalDate = new Date();
	finalDate.setDate(today.getDate() + 6);
	//store the values of the query
	const active = req.query.active;
	let entryPromise;
	//if query is undefined, get all the entries
	if(typeof(active) === "undefined"){
		entryPromise = Entry.find().populate('title');
	}
	//if the query has a value
	else if(typeof(active) === "string"){
		//if value is true, show entries that are active
		if(active === "true"){
			entryPromise = Entry.find({endingDate: {$gte: today}, startingDate: {$lte: finalDate}}).populate('title');
		}
		//else show the past entries
		else if(active === "false") {
			entryPromise = Entry.find({endingDate: {$lt: today}}).populate('title');
		}
		//everything else
		else {
		const message = 'Query value unexpected.';
		return res.status(400).send(message);
		}
	}
	else{
		const message = 'Query value unexpected.';
		return res.status(400).send(message);
	}
	entryPromise
	.then(data => res.status(200).json(data))
	.catch(err => res.status(500).send(err));
});

//View a single user account/profile
router.get('/:id', (req, res) => {
	Entry.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//View a single title by user
router.get('/:id/:title', (req, res) => {
	Entry.find({title: req.params.title, id: req.params.id})
	.then(data => {console.log(data[0].titles); res.status(200).json(data);})
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

module.exports = router;
