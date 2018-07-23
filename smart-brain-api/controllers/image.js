const Clarifai = require('clarifai');


const handleImage = (req,res,db)=>{
	const {id} = req.body;
	db('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries=>{
		res.json(entries[0]);
	})
	.catch(err=>res.status(400).json('unable to get entries'));
}



const handleApiCall = (req,res) => {
	const app = new Clarifai.App({
 		apiKey : 'f732806ab136409c9b861793bccc33d9'
	});
	const {input} = req.body;
	app.models.predict(Clarifai.FACE_DETECT_MODEL,input)
	.then(data => res.json(data))
	.catch(err => res.status(400).json('unable to make api call'));
}

module.exports = {
	handleImage:handleImage,
	handleApiCall:handleApiCall
};