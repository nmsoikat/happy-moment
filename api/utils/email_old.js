const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD
    // }
    //activate in gmail "less secure app" option

    //mailtrap
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }

  })

  //2) Define the email options
  const mailOptions = {
    from: 'Nur Mohammad <nur@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.textMessage,
    // html: options.htmlMessage,
  }

  //3) Actually send the email
  await transporter.sendMail(mailOptions) //this return promise
}

module.exports = sendEmail;