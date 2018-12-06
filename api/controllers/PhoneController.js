module.exports = {
    PhoneNumber,
    emailValidation,
    imageValidator
};

const phone = require("phone");                     // package to verify phone number
const _ = require('lodash');                        // helper package 
const sizeOf = require('image-size');               // package to get image details

function PhoneNumber(req, res){                     // function to verify phone number
    let data = req.body;
    if(_.isEmpty(data.phone_number)) return res.badRequest({error : [{message : "Please provide phone number", errorType : '400'}], data : []})
    let varification_result = phone(data.phone_number)
    if(_.isEmpty(varification_result))
        return res.badRequest({error : [], data : [{message : 'Invalid phone number', number : _.first(varification_result)}]})
    return res.ok({error : [], data : [{number : _.first(varification_result), country : varification_result[1]}]})

}

function emailValidation(req, res){                 //function to verify email address
    let data = req.body;
    if(_.isEmpty(data.email_address)) return res.badRequest({error : [{message : "Please provide email address", errorType : '400'}], data : []})
    let result = checkEmail(data.email_address)
    if(result)
        return res.ok({error : [], data : [{isValid : result, email_address : data.email_address}]})
    return res.badRequest({error : [{isValid : result, email_address : data.email_address}], data : []})
}

function imageValidator(req, res){              //function to check image resolution
    if(req.file('image_content')._files.length == 0)
        return res.badRequest({error : [{message : "Please provide image file", errorType : '400'}], data : []}) 
    let file_extension = req.file('image_content')._files[0].stream.headers['content-type'];
    if(file_extension.search("image/") < 0)  
        return res.badRequest({error : [{message : "Please provide image file only", errorType : '400'}], data : []})  
    const image_file = req.file('image_content').upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    }, function(err, file_details){
        if(err) res.ok(err)
        if(_.first(file_details).field == "image_content"){
            let file_dimension = sizeOf(_.first(file_details).fd)
            let image_height = file_dimension.height / 10; // at 250 dpi
            let image_width = file_dimension.width / 10;  //at 250dpi
            if(image_height > 20 || image_width > 20) 
                 return res.badRequest({error : [{message : "Please provide image file with 2mm * 2 mm with 250 DPI", errorType : '400'}], data : []})
            else 
                return res.ok({error : [], data : [{message : "Image uploaded with all requirements"}]})
        }
        else return res.badRequest({error : [{message : "Please provide image file only", errorType : '400'}], data : []})
    })
}


////// RFC822 for email validation  

function checkEmail(emailAddress) {
    var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
    var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
    var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
    var sQuotedPair = '\\x5c[\\x00-\\x7f]';
    var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
    var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
    var sDomain_ref = sAtom;
    var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
    var sWord = '(' + sAtom + '|' + sQuotedString + ')';
    var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
    var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
    var sAddrSpec = sLocalPart + '\\x40' + sDomain;
    var sValidEmail = '^' + sAddrSpec + '$';
    var reValidEmail = new RegExp(sValidEmail);
    return reValidEmail.test(emailAddress);
}

