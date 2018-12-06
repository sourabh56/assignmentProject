
module.exports = {
	getPinCode
};

const googleApiService = require('../services/googleApiCall');  // Service to call google api and get pin code

async function getPinCode(req, res){
	if(_.isEmpty(req.param('address_input')))
		return res.badRequest({error : [{message : "Please provide address", errorType : '400'}], data : []}) // if address is not given

	await googleApiService.getPinCode({address_given : req.param('address_input'), api_key : req.param('api_key')})
	.then(message =>{
		res.ok(message) // send response from service
	})
	.catch(error => res.badRequest(error))
}

