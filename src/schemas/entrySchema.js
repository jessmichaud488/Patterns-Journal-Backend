const mongoose = require('mongoose');
const { User } = require('./userSchema');

mongoose.Promise = global.Promise;

var entrySchema = mongoose.Schema({
  user: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    required: true
  },

	title: {
		type: String,
		required: true
	},

  sleep: {
    type: Number,
    required: true
  },

  entry: {
    type: String, 
    required: true
  },

  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  mood: {
    type: String,
    required: true
  },

  emotions: {
    type: Number,
    required: true
  }

});

entrySchema.virtual('hourMin').get(function(){
	return `${this.time.hour}:${this.time.minutes}`;
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry};