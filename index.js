"use strict"
import nodemailer from "nodemailer"
import "dotenv/config"
import { logger } from "./logger.js"

// console.log("starting...")
logger.info("starting...")

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
    subject: "🎵 Tay Bot 🎵", // Subject line
    html: "Hello, GET IN THE QUEUE  --> https://www.ticketmaster.ca/taylor-swift-the-eras-tour-toronto-ontario-11-21-2024/event/10005F01FC4E4BD4", // html body
  });
  logger.info("Message sent: %s", info.messageId);
}

//Check if the day is Monday, if so, run the email mailer
function validateDate() {
  let d = new Date(Date())
  d.setDate(d.getDate() + 1) //set the day 1 day in the future
  const date = d.getDate()
  const day = d.getDay()
  if (date <= 7 && day === 2) {
    //run below if "tomorrow" is the first Tuesday of the month
    logger.warn({ tomorrow: d, jsDate: date, jsDay: day }, "Smoke Meat Day!")
    sendReminder().catch(console.error)
  } else {
    logger.info({ tomorrow: d, jsDate: date, jsDay: day }, "no joy!")
  }
}

//Quality of life func
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
import { Builder, Browser, By, Key, until } from "selenium-webdriver"
import firefox from 'selenium-webdriver/firefox.js';

  ; (async function example() {

    let options = new firefox.Options()
    //options.addArguments("-headless")

    let innerText
    let driver = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(options)
      .build();
    while (true) {
      try {
        await driver.get(process.env.WATCHED_URL)
        const xpath = "//div[contains(text(), 'Sorry, tickets are not currently available online.')]";
        const divElement = await driver.wait(until.elementLocated(By.xpath(xpath)), 5000);
        logger.info("DIV Element Found!")
        // const divText = await divElement.getText();
        // console.log('Found div with text:', divText);
      }catch (error) {
        if (error.name === 'NoSuchElementError') {
          logger.warn("DIV Element Not Fount!")
          sendReminder()
          sleep(30000)
          await driver.quit()
        } else {
          console.error('#An error occurred:', error.message)
          //sendReminder()
        }
      } 
      finally {
        //await driver.quit()
        // Wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 30) * 100));
        // Refresh the page
        await driver.navigate().refresh();
        //console.log('Page refreshed');
      }
    }
  })()



//Main loop
// while(true){
//   await sleep(1000);//3000ms
//   //validateDate();
// }