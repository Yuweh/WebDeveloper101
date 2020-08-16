// server.js
// where your node app starts

"use strict";
const nodemailer = require("nodemailer");
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());

//Data are received by POST request

app.post('/', function(req, res) {
    console.log(req.body)
    if(req.body.key == process.env.KEY){ //We check is the secret key is present in the POST request if not we generate a 403 response.
      sendEmail(req.body).then(function(rep){
        var result = {result:rep} //We send back a simple JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
      }).catch(function (error){
        res.status(500).send(error); 
      });
    }else{
       res.status(403).send('Not Authorized'); 
    }
});


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) { //Basic function for GET request
  response.status('200').send('(╯°□°）╯︵ ┻━┻');
});

app.listen(8080);


async  function sendEmail(options){

 let  transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: process.env.SECURE, 
    auth: {
      user: process.env.USER, 
      pass: process.env.PASS 
    }
  });
  let  mailOptions = {
    from: options.from, // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.textBody, // plain text body
    html: options.htmlBody // html body
  };
  // send mail with defined transport object
  let  info = await  transporter.sendMail(mailOptions)
  console.log("Message sent: %s", info.messageId);
  return info.messageId;
}

var RelayApp = {};
RelayApp.sendEmail = function (recipient, subject, body, options){
var url = "https://use-your-own.glitch.me/";
var KEY = "generate you own key";
if(!options.from){
    if(!options.name){
      options.from = Session.getEffectiveUser().getEmail();
    }else{
      options.from = options.name + '<'+Session.getEffectiveUser().getEmail()+'>';
    }
  }
  options.to = recipient;
  options.subject = subject;
  options.textBody = body
  options.key =KEY;
  var params = {method: 'POST',
                headers:{'content-type' : 'application/json'},
                payload: JSON.stringify(options),
                muteHttpExceptions:false  }; 
  var content =  UrlFetchApp.fetch(url, params) ;
  var rep = JSON.parse(content.getContentText());
  Logger.log(rep.result); //Must be ID of email sent
}
