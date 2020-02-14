const Config = require("../config");
var couchbase = require('couchbase');
var moment = require('moment');
const sgMail = require('@sendgrid/mail');
const pug = require('pug');

sgMail.setApiKey( Config.SENDGRID_API_KEY );

var N1qlQuery = couchbase.N1qlQuery;
var cluster = new couchbase.Cluster('couchbase://'+Config.DB_HOST);
cluster.authenticate( Config.DB_USER, Config.DB_PASS );
var bucket = cluster.openBucket(Config.DB_NAME);



// Display list of all Authors.
exports.introEmail = function() {

  try{

    let last_timestamp = moment().subtract(Config.CRON_INTERVAL,'minutes').format();
    
    // let _n1ql = `
    //             select email,firstName,surname 
    //             from ${Config.DB_NAME} 
    //             where 
    //               type = 'personalTrainer' AND 
    //               ptSignUpCompleted = true AND 
    //               signUpCompleted = true AND
    //               createdAt > '${last_timestamp}'
    //             `;

    let _n1ql = `
                select email,firstName,surname 
                from ${Config.DB_NAME} 
                where 
                  type = 'personalTrainer' AND 
                  ptSignUpCompleted = true AND 
                  signUpCompleted = true AND
                  createdAt > '2018-12-04T15:13:50+05:30'
                `;

    var query = N1qlQuery.fromString(_n1ql);

    bucket.query(query, function(err, rows, meta) {
      
      if(err){
        console.log(err.Error);
      }else{
        // rows = JSON.parse(rows);
        for (key in rows) {
          
          let pt = rows[key];
          
          var notificaton_doc = "noti_" + pt.email.replace(/[@\.]/g, "_");

          var notification_data = {};
          bucket.manager().createPrimaryIndex(function() {

              bucket.get( notificaton_doc, function(err, result) {

                  if (err) {
                      if (err.code == couchbase.errors.keyNotFound) {
                      } else {
                          console.log('Some other error occurred: %j', err);
                      }
                  } else {
                      // notification_data = 
                      console.log('Retrieved document with value: %j', result.value);
                      console.log('CAS is %j', result.cas);
                  }

                  // Compile the source code
                  const compiledFunction = pug.compileFile('./views/email/intro.pug');

                  const msg = {
                    to: pt.email,
                    from: Config.EMAIL_FROM,
                    subject: 'Welcome to litehq!',
                    // text: 'and easy to do anywhere, even with Node.js',
                    html: compiledFunction({
                            base_url: Config.APP_URL,
                            first_name: 'Timothy'
                          })
                  };
                  
                  // Check if Intro Mail not sent then send it again
                  if(!notification_data.intro){

                    sgMail.send(msg).then(function(result){

                        notification_data["intro"] = true;
                          
                        bucket.upsert(notificaton_doc, 
                                      notification_data,
                                      function (err, result) {

                                        if(!err){
                                          console.log("email sent to:"+pt.email)
                                        }
                                        
                                      });
    
                    });
                  }


              });
          });

        }
      }

    });

  }
  catch(err){
    cluster.authenticate( Config.DB_USER, Config.DB_PASS );
    bucket = cluster.openBucket(Config.DB_NAME);
    console.log("err",err)
  }


};



// Display list of all Authors.
exports.fornightlyEmail = function() {

  try{

    let last_timestamp = moment().subtract( 2,'week').format();
    
    let _n1ql = `
                select email,firstName,surname 
                from ${Config.DB_NAME} 
                where 
                  type = 'personalTrainer' AND 
                  ptSignUpCompleted = true AND 
                  signUpCompleted = true AND
                  createdAt > '${last_timestamp}'
                `;

    var query = N1qlQuery.fromString(_n1ql);

    bucket.query(query, function(err, rows, meta) {
      
      if(err){
        console.log(err.Error);
      }else{
        // rows = JSON.parse(rows);
        for (key in rows) {
          
          let pt = rows[key];
          
          var notificaton_doc = "noti_" + pt.email.replace(/[@\.]/g, "_");

          var notification_data = {};
          bucket.manager().createPrimaryIndex(function() {

              bucket.get( notificaton_doc, function(err, result) {

                  if (err) {
                      if (err.code == couchbase.errors.keyNotFound) {
                      } else {
                          console.log('Some other error occurred: %j', err);
                      }
                  } else {
                      // notification_data = 
                      console.log('Retrieved document with value: %j', result.value);
                      console.log('CAS is %j', result.cas);
                  }

                  // Compile the source code
                  const compiledFunction = pug.compileFile('./views/email/intro.pug');

                  const msg = {
                    to: pt.email,
                    from: Config.EMAIL_FROM,
                    subject: 'Welcome to litehq!',
                    // text: 'and easy to do anywhere, even with Node.js',
                    html: compiledFunction({
                            base_url: Config.APP_URL,
                            first_name: pt.firstName
                          })
                  };
                  
                  // Check if Intro Mail not sent then send it again
                  if(!notification_data.fornightly){

                    sgMail.send(msg).then(function(result){

                        notification_data["fornightly"] = true;
                          
                        bucket.upsert(notificaton_doc, 
                                      notification_data,
                                      function (err, result) {

                                        if(!err){
                                          console.log("email sent to:"+pt.email)
                                        }
                                        
                                      });
    
                    });
                  }


              });
          });

        }
      }

    });

  }
  catch(err){
    cluster.authenticate( Config.DB_USER, Config.DB_PASS );
    bucket = cluster.openBucket(Config.DB_NAME);
    console.log("err",err)
  }


};
