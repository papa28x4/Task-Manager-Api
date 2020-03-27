const express = require('express');
const mongoose = require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const bcrypt = require('bcryptjs');




const app = express();
const port = process.env.PORT;


app.use(express.json())
app.use("/users", userRoutes)
app.use("/tasks", taskRoutes)



app.listen(port, ()=>{
	console.log('Listening on port '+ port)
})

