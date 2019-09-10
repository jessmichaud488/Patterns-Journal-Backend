const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var entrySchema = mongoose.Schema({
	title: {
		type: Schema.Types.ObjectId,
		required: true
	},

  hoursSlept: {
    type: Number,
    required: true
  },

  entryType: {
    type: String, 
    required: true
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  intensityLevel: {
    type: Number,
    required: true
  }

});

entrySchema.virtual('hourMin').get(function(){
	return `${this.time.hour}:${this.time.minutes}`;
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry};