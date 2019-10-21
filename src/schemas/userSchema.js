const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
	email: {
		type: String
	},

	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	}
});

userSchema.methods.serialize = function() {
  return {
    email: this.email,
    id: this._id,
    username: this.username
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};