const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail=(name, email)=>{
	sendgrid.send({
	to: email,
	from: 'papa28x4@gmail.com',
	subject: `Welcome on board`,
	text: `Thank you, ${name}, for subscribing. We hope you enjoy your stay here`
	})
}

const cancellationEmail=(name, email)=>{
	sendgrid.send({
	to: email,
	from: 'papa28x4@gmail.com',
	subject: `GoodBye`,
	text: `Dear ${name}, we are sad to see you leave. Is there anything we would have done to make you stay`
	})
}


module.exports = {
	welcomeEmail,
	cancellationEmail
}