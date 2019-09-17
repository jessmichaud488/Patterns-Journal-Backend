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

//View entries by title
router.get('/:title', (req, res) => {
	Entry.find({title: req.params.title})
	.then(data => res.status(200).json(data))
	.catch(err => {
		res.status(500).send(internalMsg);
	});
});

//View entries by mood(entryType)
router.get('/:entryType', (req, res) => {
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
    .then(data => {
    	//if no document was found with matching title, look in the entry collection
    	if(data === null && typeof(data) === 'object'){
        	return Entry.findOne({title: req.body.title})
        			.then(data => {
        				if(data === null && typeof(data) === 'object'){
        					res.send(message);
        				}
        					else{
        						res.send(message);
        					}
        			});
    	}

	router.delete('/', (req, res) => {
        Entry.remove({
            _id: req.params.bear_id
        }, function(err, entry) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


module.exports = router;
