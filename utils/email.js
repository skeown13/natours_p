const nodemailer = require("nodemailer")

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
    // ACTIVATE IN GMAIL "less secure app option"
    // shouldn't use gmail in production as you can only send 500 emails a day and will quickly be marked as spam. --- should instead use sendgrid or mailgun
  })

  // 2) Define the email options
  const mailOptions = {
    from: "Stacy Keown <no@no.no>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  }

  // 3) Actually send the email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
