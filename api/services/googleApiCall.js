module.exports={
getPinCode
}

const _ = require('lodash')
const request = require('request-promise-native');    // package to call google api with promise return

function getPinCode(options = {}){
    return new Promise((resolve, reject) =>{
        let {address_given, api_key} = options;
        let api_key_default = 'AIzaSyDHAkYmNCzG7moHG02TUg723GpsR2KR4t0' ;
        api_key = api_key ? api_key : api_key_default;                             // if this api key doesn't work new api key can be sent from front end
        let google_api_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
        request.get({
            uri: `${google_api_url}`,
            qs: {                                                                   // params in URL
                address: address_given, 
                key: api_key
            },
            json: true
        })
        .then(address_details =>{
            if(address_details && address_details.status == 'OK'){
                getRequiredDetails(address_details)
                .then(transform => resolve({error : [], data : [{pin_code : transform.pin_code, actual_address : transform.address}]}))
                .catch(err => reject ({error : [], data : [{'message' : 'Please provide more details', 'type' : 'Insufficient address'}]}))
            }
            else 
                resolve({error : [], data : [{'message' : 'Please provide more details', 'type' : 'Insufficient address'}]})	
        })
        .catch(err => {
            reject({error : [{'message' : 'Please check internet connection', 'type' : 'connection failed'}], data : []})
        })
    })
}

function getRequiredDetails(address_details){                       // function to extract required details
	return new Promise((resolve, reject) =>{
        let details = _.map(address_details.results, getAddressComponent)
        if(_.first(details).pin_code)
              resolve(_.first(details))
        else  reject("error")
	})
}

function getAddressComponent(data){                                // function to extract expected address
	let details = {}
	if(data.address_components) details.pin_code =  _.toString(_.filter(_.map(data.address_components, getPinCodeFromAddress)))
   
	if(data.formatted_address) details.address = data.formatted_address;
   return details
}
function getPinCodeFromAddress(data){
	if(data.types == "postal_code") return(data.long_name)
}