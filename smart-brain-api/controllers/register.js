const handleRegister = (req,res,db,bcrypt)=>{
	const{email,name,password} = req.body; //destructuring
	if(!email||!name||!password){ // checking blank fields
		return res.status(400).json('All fields are mandatory!!!');
	}
	const etest=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	if(etest.test(email)==false)
	{
		return res.status(400).json('Email Id not valid...please enter a valid email id!!!');
	}
	
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
		.catch(()=>{
			trx.rollback;
			return res.status(400).json('User already registered...register using different email!!');
		});
	})
	.catch(err => res.status(400).json('unable to register'));
}

module.exports = {
	handleRegister : handleRegister
};