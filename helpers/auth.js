// var flash = require('connect-flash');
var bcrypt = require('bcrypt');
const moment = require('moment');
const crypto = require('crypto');
const Config = require("../config");
const jwt = require('jsonwebtoken');

module.exports = {

    isValidDate:function(date){
        var formats = [moment.defaultFormat,"YYYY-MM-DD LT","YYYY-MM-DD h:mm:ss A","YYYY-MM-DD HH:mm:ss","YYYY-MM-DD HH:mm"];
        return moment(date, formats, true).isValid();
    },

    isWithinRange(text, min, max) {
        // check if text is between min and max length
    },

    resetToken:function() {
        // Will generate 6 digits of code
        return Math.floor(100000 + Math.random() * 900000);  
    },

    cryptPassword:function(password) {

        return new Promise((resolve, reject) => {

            bcrypt.genSalt(Config.CRYPT_ROUNDS, function(err, salt) {
                if (err)
                    return reject(err);

                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) 
                        return reject(err);

                    return resolve(hash);
                });
            });

        });
        
    },
     
    comparePassword:function(plainPass, hashword) {

        return new Promise((resolve, reject) => {
                bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
                    return isPasswordMatch ?
                        resolve(isPasswordMatch) :
                        reject(err);
                });
        });
    },

    genrateToken:function(req, res){
        try{
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update( req.body.email + Config.JWT_SECRET ).digest("base64");
            req.body.refreshKey = salt;
            let token = jwt.sign(req.body, Config.JWT_SECRET);
            // let refresh_token = new Buffer.alloc(hash).toString('base64');
            let refresh_token = new Buffer(hash).toString('base64');
            return { accessToken: token, refreshToken: refresh_token };
        } catch (err) {
            res.status(200).json({error:true, msg: "Err(DMHAU65): "+err });
        }

    },


    compareRefToken:function(req){

        return new Promise((resolve, reject) => {
            let b = new Buffer(req.body.refresh_token, 'base64');
            let refresh_token = b.toString();
            let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.email + Config.JWT_SECRET).digest("base64");

            if (hash === refresh_token) {
                resolve(true);
            } else
                reject("Invalid refresh token!");       
        });

    }
}