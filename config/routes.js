
module.exports.routes = {

  'POST /phonevalidator' : [{
    controller : 'PhoneController', action : 'phoneNumber'
  }],
  'GET /getpincode' : [{
    controller : 'googleApiController', action : 'getPinCode'
  }],
  'POST /emailvalidator' : [{
    controller : 'PhoneController', action : 'emailValidation'
  }],
  'POST /uploadimage' : [{
    controller: 'PhoneController', action : 'imageValidator'}]
};
