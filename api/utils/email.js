const nodemailer = require('nodemailer')
const pug = require('pug')
const {htmlToText} = require('html-to-text')
const fs = require('fs')

module.exports = class Email{
  //define email options
  constructor(user, url){
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Nur Mohammad ${process.env.EMAIL_FORM}`
  }

  //Create a transporter
  newTransport(){
    // if(process.env.NODE_ENV === 'production'){
      // sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth:{
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        }
      })
    // }
    
    //mailtrap inbox using nodemailer
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // })
  }

  //actual send
  async send(template, subject){
    //1) Render html
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })

    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    }

    //3) Create a transport and send mail
    await this.newTransport().sendMail(mailOptions)
  }

  //Welcome Mail
  async sendWelcome(){
    await this.send('welcome', 'Welcome to our family!');
  }
  
  //Forgot Password Mail
  async sendResetPassword(){
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
  
}