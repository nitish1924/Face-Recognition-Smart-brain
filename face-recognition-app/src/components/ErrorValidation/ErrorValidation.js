import React from 'react';

const ErrorValidation = ({error}) => {
	return(
		<div>
			<h2 style={{color:'red'}}>{error}</h2>
		</div>
	);
}

export default ErrorValidation;