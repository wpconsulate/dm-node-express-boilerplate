const AuthModel = require("../models/AuthModel");
const herlper = require("../helpers/global");
var validator = require('validator')


isValidInput = (req,res, next) => {

    // Check Email exists
    if( req.body.email === undefined )
      return herlper.sendError(res, 400, "Email is required");
    
    else if( !validator.isEmail(req.body.email) )
      return herlper.sendError(res, 400, "Invalid email provided");
    
    else if( req.body.secret === undefined )
      return herlper.sendError(res, 400, "Secret is required");
    
    else if( validator.isLength(req.body.secret, {max:1}) )
      return herlper.sendError(res, 400, "Secret is required!");
    else
      return "OK";

};


isEmailExists = (req, res, next) => {

  return next();
  // AuthModel.findByEmail(req.body.email)
  //     .then((user)=>{
  //         if(user.data){
  //             return herlper.sendError(res, 409, "User already exists with given Email! Try forgot password!");
  //         }
  //         return next();
  //     })
  //     .catch(function(err){
  //         // return herlper.sendError(res, 400, err+": Invalid User!");
  //         return herlper.sendError(res, 400, "Invalid User!");
  //     });
};

exports.validateUserdata = (req, res, next) => {
  
    const validInput =  isValidInput(req, res, next);
    console.log("validInput",validInput)
    if( "OK" == validInput ){
        return isEmailExists(req, res, next);
    }
    return validInput;  
};