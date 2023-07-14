"use strict"
const cron = require("node-cron")
const nodemailer = require("nodemailer")
require('dotenv').config()
//console.log(process.env)

let t = new Date(Date.now())

//Schedule task to run on FIRST tuesday of each month
var task = cron.schedule("30 12 */100,1-7 * TUE", () => {
  //log time
  console.log(t.toUTCString())
  //sendReminder().catch(console.error);
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
async function sendReminder() {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_SENDER, // sender address
    to: process.env.EMAIL_RECEIVER, // list of receivers
    subject: "Smoked Meat Tuesday", // Subject line
    html: "Hello, This is a friendly reminder that <h3>🔥TODAY🔥</h3> the smoked meat plater is <b>10.99$</b> at you know where", // html body
  });
  console.log("Message sent: %s", info.messageId);
}
