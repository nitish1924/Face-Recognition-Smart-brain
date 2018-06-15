const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')

const db = knex({
  client:'pg',
  connection: {
    host : '127.0.0.1', //localhost
    user : 'postgres', // you can set it to your name too in DB.
    password : 'nitish',
    database : 'smart-brain'
  }
});

// postgres.select('*').from('users').then(data=>{
// 	console.log(data);
// });

const app = express();

app.use(cors());
app.use(bodyParser.json()); // since body-parser is a middleware

app.get('/',(req,res)=>{
	res.send(database.users);
})

app.post('/signin',(req,res)=>{
	const {email,password} = req.body;
	db.select('email','hash').from('login')
		.where('email','=',email)
		.then(data=>{
			const isValid = bcrypt.compareSync(password,data[0].hash);
			if(isValid){
				return db.select('*').from ('users')
					.where('email','=',email)
					.then(user=>{
						res.json(user[0])
					})
					.catch(err=>res.status(400).json('unable to get user'));
			}else{
				res.status(400).json('wrong credentials');
			}
	})
	.catch(err=>res.status(400).json('unable to get user'));	
})

app.post('/register',(req,res)=>{
	const{email,name,password} = req.body; //destructuring
	const hash=bcrypt.hashSync(password);
	db.transaction(trx => { // transactions are there to ensure consistency between multiple tables
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({ //.returning('*') return all the fields of the row inserted
				email:email,
				name:name,
				joined:new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id',(req,res)=>{
	const {id} = req.params;
	db.select('*').from('users').where('id',id)
		.then(user=>{
			if(user.length){
				res.json(user[0]);
			}else{
				res.status(400).json('not found');
			}
		})
		.catch(err=>res.status(400).json('error getting user'));
})

app.put('/image',(req,res)=>{
	const {id} = req.body;
	db('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries=>{
		res.json(entries[0]);
	})
	.catch(err=>res.status(400).json('unable to get entries'));
})

app.listen(3000,()=>{
	console.log('running at port 3000')
})
