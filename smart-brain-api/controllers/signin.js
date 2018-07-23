const handleSignin = (req,res,db,bcrypt)=>{
	const {email,password} = req.body;
	if(!email||!password){ // checking blank fields
		return res.status(400).json('All Fields are Mandatory!!');
	}
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
				res.status(400).json('Wrong credentials');
			}
	})
	.catch(err=>res.status(400).json('Wrong Credentials...Try Again!!'));	
}

module.exports = {
	handleSignin : handleSignin
};