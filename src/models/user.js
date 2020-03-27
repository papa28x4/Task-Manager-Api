const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task.js');

const userSchema =  new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email:{
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('Email is invalid')
			}
		}
	},
	password:{
		type: String,
		required: true,
		trim: true, 
		validate(value){
			if(value.length <= 6 || value.toLowerCase().includes("password")){
				throw new Error("Password doesn't meet the requirements. It should be greater than 6 chars and not contain the word password")
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value){
			if(value < 0) throw new Error('Age must be a +ve number')
		}
	},
	tokens: [{
		token:{
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
},{
	timestamps: true
})


//creating relationship btw two entities
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
})



userSchema.methods.toJSON = function(){
	const user = this;
	const userObject = user.toObject();
	
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;
	return userObject;
}

userSchema.methods.generateAuthToken = async function(){
	const user = this;
	const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
}

userSchema.statics.findByCredentials = async(email, password) => {
	const user = await User.findOne({email});
	if(!user){
		throw new Error('Unable to login');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if(!isMatch){
		throw new Error('Unable to login');
	}

	return user;
}

 //should be a normal function not an arrow because this places an important role (this binding)
userSchema.pre('save', async function(next){
	const user = this;

	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 10)
	}

	console.log('just before saving')

	next();
})

userSchema.pre('remove', async function(next){
	
	const user = this;
	await Task.deleteMany({owner: user._id})
	next()
})
const User = mongoose.model('User', userSchema)

module.exports = User;