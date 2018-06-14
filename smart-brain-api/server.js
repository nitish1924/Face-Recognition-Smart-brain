const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json()); // since body-parser is a middleware

const database = {
	users:[
		{
			id: "123",
			name: 'john',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()

		},
		{
			id: "124",
			name: 'sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()

		}

	]
}

app.get('/',(req,res)=>{
	res.send(database.users);
})

app.post('/signin',(req,res)=>{
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password ){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}
})

app.post('/register',(req,res)=>{
	const{email,name,password} = req.body; //destructuring
	console.log(email);
	database.users.push({
			id: "125",
			name: name,
			email: email,
			entries: 0,
			joined: new Date()
	})
	res.json(database.users[database.users.length-1]); // responding with last item in array
})

app.get('/profile/:id',(req,res)=>{
	const {id} = req.params;
	let found = false;
	database.users.forEach(user=>{
		if(user.id === id) {
			found = true;
			return res.json(user);
		} 
	})

	if(!found){
		res.status(400).json('user not found');
	}
})

app.put('/image',(req,res)=>{
	const {id} = req.body;
	let found = false;
	database.users.forEach(user=>{
		if(user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		} 
	})

	if(!found){
		res.status(400).json('user not found');
	}
})

app.listen(3000,()=>{
	console.log('running at port 3000')
})
