// const mongodb = require('mongodb');
// const mongoClient = mongodb.MongoClient;
// const ObjectID = mangodb.ObjectID;

const{ MongoClient, ObjectID} = require('mongodb')

// const connectionURL = 'mongodb://127.0.0.1:27017';
const connectionURL = process.env.MONGODB_URL
const dbName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client)=>{
	if(error){
		return console.log('Unable to connect to database');
	}
	// console.log('connection successful')
	const db = client.db(dbName);



	/* Delete Documents */

	db.collection('users').deleteMany({
		age : 28
	}).then(result => console.log(result))
	.catch(error => console.log(error))



	db.collection('tasks').deleteOne({
		description: "Learn React"
	})
	.then(result => console.log(result))
	.then(error => console.log(error))
	/* Update documents */

	// db.collection('tasks').updateMany({completed: false},{
	// 	$set: {
	// 		completed: true
	// 	}
	// }).then(result => console.log(result.matchedCount, result.modifiedCount))
	// 	.catch(error => console.log('error'))








	/* Read documents */

	// db.collection('users').findOne({_id: ObjectID("5e699938037ca634b0d0370a")},(error, result)=>{

	// 	if(error){
	// 		return console.log('unable to fetch')
	// 	}

	// 	console.log(result)
	// })

	// db.collection('users').find({name: "Lilian"}).toArray((error, users)=>{
	// 	if(error){
	// 		return console.log('unable to fetch');
	// 	}
	// 	console.log(users);
	// })


	// db.collection('users').find({name: "Lilian"}).count((error, count)=>{
	// 	if(error){
	// 		return console.log('unable to fetch');
	// 	}
	// 	console.log(count);
	// })

	/* Create documents */

	// db.collection('users').insertOne({
	// 	name: "Bassey",
	// 	age: 25,
	// 	sex: "male"
	// }, (error, result)=>{
	// 	if(error){
	// 		return console.log('unable to insert user');
	// 	}
	// 	console.log(result.ops)
	// })
	// console.log(db.collection('users').find({name: "Lilian"}))

	// db.collection('tasks').insertMany([{
	// 		description : "Read the mongodb documentation",
	// 		completed: false
	// 	},{
	// 		description: "Build a web api",
	// 		completed: true
	// 	},{
	// 		description: "Get a job",
	// 		completed: true
	// 	}
	// ], (error, result)=>{
	// 	if(error){
	// 		return console.log('Unable to create tasks')
	// 	}
	// 	console.log(result.ops)
	// })


	// db.collection('tasks').insertMany([{
	// 		description: "Create border animations for Lilian",
	// 		completed: true
	// 	},
	// 	{
	// 		description: "Learn React",
	// 		completed: false
	// 	}
	// ], (error, result)=>{
	// 	if(error){
	// 		return console.log('Unable to create tasks')
	// 	}
	// 	console.log(result.ops)
	// })

	// db.collection('tasks').findOne({_id:ObjectID("5e69a2d87851651cacdd14b0")}, (error, task)=>{
	// 	if(error){
	// 		return console.log('unable to fetch task');
	// 	}
	// 	console.log(task)
	// })
	// db.collection('tasks').find({completed: false}).toArray((error, tasks)=>{
	// 	if(error){
	// 		return console.log('unable to fetch tasks');
	// 	}
	// 	console.log(tasks)
	// })


})



