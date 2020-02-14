const moment = require('moment');
const sgMail = require('@sendgrid/mail');
const Config = require("../config");

sgMail.setApiKey( Config.SENDGRID_API_KEY );

module.exports = {

    sendError:function(res, code, error){
        return res.status(code).json({error:true, message: error});
        
    },

    /**
     * 
     * @param {*} to 
     * @param {*} from 
     * @param {*} subject 
     * @param {*} htmlBody 
     * @param {*} textBody 
     * @returns Promise
     */
    sendEMail:function(to, from, subject, htmlBody, textBody) {

      const msg = {
        to: to,
        from: from,
        subject: subject,
        text: textBody,
        html: htmlBody
      };

      return sgMail.send(msg);
  }
}