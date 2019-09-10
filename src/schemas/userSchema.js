const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	},

	userName: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	verified: {
		type: Boolean,
		required: true,
		default: false
	},

	memberSince: {
		type: Date,
		required: true,
		default: Date.now
	},
  
	isActive: {
		type: Boolean,
		required: true,
		default: true
	}
});

userSchema.methods.serialize = function() {
  console.log("User schema serialized method = " + this)
  return {
    email: this.email,
    id: this._id,
    userName: this.userName,
    verified: this.verified,
    memberSince: this.memberSince,
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