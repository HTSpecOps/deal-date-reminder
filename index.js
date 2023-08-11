"use strict"
import cron from "node-cron"
import nodemailer from "nodemailer"
import "dotenv/config"
import {logger} from "./logger.js"

// console.log("starting...")
logger.info("starting...")
//Schedule task to run once a day
var task = cron.schedule(process.env.CRONTAB, () => {
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
  logger.info("Message sent: %s", info.messageId);
}

//Check if the day is Monday, if so, run the email mailer
function validateDate(){
  let d = new Date(Date())
  d.setDate(d.getDate()+1) //set the day 1 day in the future
  const date = d.getDate()
  const day = d.getDay()
  if(date<=7 && day === 2){
    //run below if "tomorrow" is the first Tuesday of the month
    logger.warn({tomorrow: d, jsDate: date, jsDay: day}, "Smoke Meat Day!")
    sendReminder().catch(console.error)
  }else{
    logger.info({tomorrow: d, jsDate: date, jsDay: day}, "no joy!")
  }
}




