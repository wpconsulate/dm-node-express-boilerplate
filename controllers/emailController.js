var Email = require('../models/EmailModel');
const sgMail = require('@sendgrid/mail');
const Config = require("../config");
const pug = require('pug');
const helper = require("../helpers/global");

sgMail.setApiKey( Config.SENDGRID_API_KEY );

// Display list of all Authors.
exports.list = function(req, res) {
  res.send('NOT IMPLEMENTED: Author list');
};

exports.email = function(req, res) {

  // var hostname = req.headers.host; // hostname = 'localhost:8080'
  // var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
  // console.log('http://' + hostname + pathname);

  // const msg = {
  //   to: 'dmarkweb@gmail.com',
  //   from: 'test@example.com',
  //   subject: 'Sending with SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // sgMail.send(msg).then(function(res){
  //   res.send(res)
  // });
  //


  // Compile the source code
  const compiledFunction = pug.compileFile('./views/email/intro.pug');

  const msg = {
    to: 'dmarkweb@gmail.com',
    from: 'test@example.com',
    subject: 'Sending with SendGrid is Fun',
    // text: 'and easy to do anywhere, even with Node.js',
    html: compiledFunction({
            base_url: Config.APP_URL,
            first_name: 'Timothy'
          })
  };
  
  sgMail.send(msg).then(function(result){
    res.send(compiledFunction({
      base_url: Config.APP_URL,
      first_name: 'Timothy'
    }))
  });
  
};



exports.sendResetPass = function(user) {

    // Compile the source code
    const compiledContents = pug.compileFile('./views/email/resetPass.pug');
    const mailContents = compiledContents({
                          base_url: Config.APP_URL,
                          first_name:  user.first_name,
                          reset_token:  user.reset_token
                        });
    
    return helper.sendEMail(
                      "dmarkweb@gmail.com",
                      Config.EMAIL_FROM,
                      "LiteHQ | Your Password Reset Request!",
                      mailContents
                    );

};