const request = require("request");
const moment = require('moment');
const authHelper = require('../helpers/auth');


// Display list of all Authors.
exports.readToken = function(req, res) {
    // Return new Promise
    return new Promise(function(resolve, reject) {
        // Read Token
        var token = db.read().value();
        if(authHelper.isTokenExpired(token)){
            reject("No Access Token Exists!");
        }else{
            resolve(token);
        }
    });
};

exports.createUser = (userData) => {

    // doc.created_at=moment().format();
    userData.created_at=moment().format('YYYY-MM-DD HH:mm:ss');

     return db.query('INSERT INTO `users` SET ?', userData);

};

exports.setUserRole = ( user_id, role_id ) => {
    
};

exports.findByEmail = (email) => {
    return db.query('SELECT * FROM `users` WHERE email = "'+email+'"');
};


exports.findByEmail_old = (email) => {
    
    return new Promise(function(resolve, reject) {
        db.query('SELECT id FROM `users` WHERE user_name = "'+email+'"', function (error, results, fields) {

            if (error) {
                return {"error":1, "msg":err};
            }

            console.log("results",results)
            
        });
    });

};


exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
    });
};


exports.setResetToken = ( updatedUser ) => {
    updatedUser.updated_at=moment().format('YYYY-MM-DD HH:mm:ss');
    updatedUser.reset_expires_at=moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
    // console.log("updatedUser",updatedUser)
    return db.query('Update `users` SET `updated_at`="'+updatedUser.updated_at+'", `reset_token`="'+updatedUser.reset_token+'", `reset_expires_at`="'+updatedUser.reset_expires_at+'" WHERE id = "'+updatedUser.id+'"');
};

exports.updatePass = ( updatedUser ) => {
    updatedUser.updated_at=moment().format('YYYY-MM-DD HH:mm:ss');
    // console.log("updatedUser",updatedUser)
    let query = 'Update `users` SET `password`="'+updatedUser.password+'", `updated_at`="'+updatedUser.updated_at+'", `reset_token`="'+updatedUser.reset_token+'" WHERE id = "'+updatedUser.id+'"';

    return db.query(query);
};


exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
