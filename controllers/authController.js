const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var authModel = require('../models/AuthModel');
const authHelper = require("../helpers/auth");
const helper = require("../helpers/global");
const mailer = require("../controllers/emailController");
const Config = require("../config");
const moment = require('moment');

const jwtSecret = Config.JWT_SECRET;

// Generate the Access Token
exports.login = function(req, res, next) {
    try {
        let refresh_token = authHelper.genrateToken(req, res);
        res.status(201).json({ error:false, auth:refresh_token });
    } catch (err) {
        res.status(200).json({error:true, msg:err});
    }
  };


exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({error:false,id: token});
    } catch (err) {
        res.status(200).json({error:true, msg:err});
    }
  };


exports.register = function(req, res, next) {

      authHelper.cryptPassword(req.body.secret)
      .then(function(pass){
          // res.status(500).json({error:true, msg:"dummy error"});
  
          emailArr = req.body.email.split("@");
  
          var userData = {
              first_name: emailArr[0],
              last_name: "User",
              email: req.body.email,
              mobile: "",
              avatar: "",
              password: pass
          };
  
          authModel.createUser(userData)
          .then((result) => {
              
              if(result[0] !== undefined && result[0].insertId){
                res.status(200).json({error:false, msg:"User is created successfully!"});
              }
              res.status(500).json({error:true, result:result});
              
          })
          .catch(function(err){
            res.status(200).json({error:true, msg:err});
          });
      })
      .catch(function(err){
        res.status(200).json({error:true, msg:err});
      });

};



exports.forgot = function(req, res, next) {
      
    // Check if User data is set by middleware
    if(req.body.user_data !== undefined){

        // res.json({user:req.body.user_data});
  
          //Generate the User's RESET Token
          req.body.user_data.reset_token = authHelper.resetToken();
          
          authModel.setResetToken(req.body.user_data)
            .then((updateRes)=>{
                if(updateRes[0].affectedRows){
                  mailer.sendResetPass(req.body.user_data)
                  .then((mailRes)=>{
                    res.json({
                      error: false,
                      msg: "An email has been sent to you with Reset Code.",
                      token: req.body.user_data.reset_token
                    });

                  })
                  .catch(function(err){
                      return helper.sendError(res, 400, err+ ": Email doesn't Exists!");
                  });
                }
            })
            .catch(function(error){
                return helper.sendError(res, 400, error+ ": Email doesn't Exists!");
            });
    }
    else{
      return helper.sendError(res, 400, "Error(DMAU105): Something went wrong, please try again later!");
    }
          
        
};



exports.updatePass = function(req, res, next) {

    authModel.findByEmail(req.body.email)
      .then((user)=>{
          if( user[0].length ){

              var $user = user[0][0];

              if($user.reset_token == req.body.token){

                if( moment().diff($user.reset_expires_at, 'minutes') < 0 ){
                
                    authHelper.cryptPassword( req.body.password )
                    .then(function(cryptedPass){

                        $user.reset_token = null;
                        $user.password = cryptedPass;

                        //update User Doc
                        authModel.updatePass($user)
                          .then((updateRes)=>{
                              res.json({
                                error: false,
                                msg: "Password has been updated successfully!"
                              });

                          })
                          .catch(function(error){
                              console.log("error",error)
                              return helper.sendError(res, 400, "Cannot reset the email please try again later!");
                          })
                    })
                    .catch(function(err){
                        return helper.sendError(res, 400, "Unable to update password, Some internal error occured!");
                    });

                }else{

                    $user.reset_token = authHelper.resetToken();

                    authModel.setResetToken($user)
                      .then((updateRes)=>{
                          if(updateRes[0].affectedRows){
                            mailer.sendResetPass($user)
                            .then((mailRes)=>{
                              res.json({
                                error: false,
                                msg: "Reset Token Expired! A new token has been sent to your email!",
                                token: req.body.user_data.reset_token
                              });

                            })
                            .catch(function(err){
                                return helper.sendError(res, 400, "Reset Token Expired! Something went wrong generating new token, please try again later!");
                            });
                          }
                      })
                      .catch(function(error){
                          return helper.sendError(res, 400, "Reset Token Expired! Something went wrong generating new token, please try again later!");
                      });
                }

              }
              else
                return helper.sendError(res, 400, "Invalid Reset Token!");

              

              
          }
      })
      .catch(function(err){
          return helper.sendError(res, 400, err+"User doesn't Exists!");
      });
};


// -------------------------------------------
// not Being Used 


exports.getById = (req, res) => {
  UserModel.findById(req.params.userId).then((result) => { 
      res.status(200).send(result);
  });
};



exports.patchById = (req, res) => {
  if (req.body.password){
      let salt = crypto.randomBytes(16).toString('base64');
      let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
      req.body.password = salt + "$" + hash;
  }
  UserModel.patchUser(req.params.userId, req.body).then((result) => {
          res.status(204).send({});
  });
};



exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId)
      .then((result)=>{
          res.status(204).send({});
      });
};