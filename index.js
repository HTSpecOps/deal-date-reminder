"use strict"
const cron = require("node-cron")
const nodemailer = require("nodemailer")
require('dotenv').config()

console.log("starting...")
//Schedule task to run on FIRST tuesday of each month
var task = cron.schedule("0 12 * * *", () => {
  validateDate()
}, {
  scheduled: false,
  timezone: "America/Toronto"
})
task.start()

//############## NODEMAILER ######################
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

//async..await is not allowed in global scope, must use a wrapper
async function sendReminder(){
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_SENDER, // sender address
    to: process.env.EMAIL_RECEIVER, // list of receivers
    subject: "Smoked Meat Tuesday", // Subject line
    html: "Hello, This is a friendly reminder that <h3>🔥TOMORROW🔥</h3> the smoked meat plater is <b>10.99$</b> at you know where", // html body
  });
  console.log("Message sent: %s", info.messageId);
}

//Check if the day is Monday, if so, run the email mailer
function validateDate(){
  let d = new Date(Date.now())
  let date = d.getDate()
  let day = d.getDay()
  if(date<=7 && day === 1){
    //log time
    console.log(d.toUTCString())
    sendReminder().catch(console.error)
  }
}




