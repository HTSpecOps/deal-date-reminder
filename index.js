"use strict"
const cron = require("node-cron")
const nodemailer = require("nodemailer")
require('dotenv').config()
//console.log(process.env)

let t = new Date(Date.now())

var task = cron.schedule("*/1 * * * *", () => {
  //log time
  console.log(t.toUTCString())
}, {
  scheduled: false,
  timezone: "America/Toronto"
})
//task.start()

//############## NODEMAILER ######################

// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      //use standard app-password login
      user: process.env.EMAIL_ACCOUNT_USER,
      pass: process.env.EMAIL_ACCOUNT_PASS,
    },
  });
  
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_SENDER, // sender address
    to: process.env.EMAIL_RECEIVER, // list of receivers
    subject: "Smoked Meat Tuesday", // Subject line
    html: "Hello, This is a friendly reminder that <h3>🔥TODAY🔥</h3> the smoked meat plater is <b>10.99$</b> at you know where", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

main().catch(console.error);
