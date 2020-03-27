const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {	welcomeEmail, cancellationEmail } = require('../emails/account')


router.post("/", async (req, res)=>{
	const user = new User(req.body);
	try{
		const result = await user.save();
		welcomeEmail(user.name, user.email);
		const token = await user.generateAuthToken();
		res.status(201).send({user, token});
	}catch(e){
		res.status(400).send(e);
	}
	
})


router.get("/me", auth, async(req,res)=>{
	res.send(req.user);
})


router.post('/login', async(req, res)=>{
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password); 
		const token = await user.generateAuthToken();

		res.send({user, token})
	}catch(e){
		res.status(400).send()
	}
})

router.post('/logout', auth, async(req, res)=>{
	try{
		req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
		await req.user.save()

		res.send("You've successfully logout")
	}catch(e){
		res.status(500).send();
	}
})

router.post('/logoutAll', auth, async(req, res)=>{
	try{
		req.user.tokens = [];
		await req.user.save();
		res.send("You successfully logout from all platforms")
	}catch(e){
		res.status(500).send();
	}
})



router.patch('/me', auth, async(req,res)=>{
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "email", "password", "age"]
	const isValidOperation = updates.every(update => {
		return allowedUpdates.includes(update);
	})
	if(!isValidOperation){
		return res.status(400).send({error: 'Invalid updates!'})
	}
	try{

		
		updates.forEach(update=>req.user[update] = req.body[update])
		await req.user.save()
		
		res.send(req.user)

	}catch(e){
		res.status(400).send(e);
	}
})

router.delete('/me', auth, async(req, res)=>{
	try{
		
		
		await req.user.remove()
		console.log('delete', req.user)
		cancellationEmail(req.user.name, req.user.email);
		res.send(req.user);
		
	}catch(e){
		res.status(500).send(e)
	}
})

router.delete('/me/avatar', auth, async (req, res)=>{
	req.user.avatar = undefined;
	await req.user.save();
	res.send({message: 'Profile image deleted successfully'})
})

router.get('/:id/avatar', async(req, res)=>{
	try{
		const user = await User.findById(req.params.id)
		if(!user || !user.avatar){
			throw new Error()
		}
		res.set('Content-Type','image/png');
		res.send(user.avatar)
	}catch(e){
		res.status(404).send()
	}
})


const upload = multer({
	
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb){
		if(!file.originalname.match(/.*\.(jpeg|jpg|png)/)){
			return cb(new Error('Please upload jpeg or png image'))
		}
		cb(undefined, true)
	}
})


router.post('/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
	const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save()	
	res.send();
}, (err, req, res, next)=>{
	res.status(400).send({error:err.message})
})



module.exports = router;