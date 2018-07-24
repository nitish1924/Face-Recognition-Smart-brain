const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  client:'pg',
  connection: {
    host : '127.0.0.1', //localhost
    user : 'postgres', // you can set it to your name too in DB.
    password : 'nitish',
    database : 'smart-brain'
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json()); // since body-parser is a middleware

app.get('/',(req,res)=>{res.send(database.users)})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/image',(req,res)=>{image.handleApiCall(req,res)})

app.listen(3000 || process.env.PORT,()=>{console.log(`running at port ${process.env.PORT}`)})
