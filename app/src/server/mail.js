import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const options = {};

const mail = {
  configure() {
    // Send mail to yourself for testing purposes.
    options.from = process.env.MAIL_USER;
    options.to = process.env.MAIL_USER;
    options.subject = 'Test';
    options.text = 'Text content';
    options.html = '<h1>HTML Header</h1>';

    options.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });
  },
  sendVerificationEmail() {
    options.transporter.sendMail(options, (err, info) => {
      if (err) return console.log(err);
      console.log('Message sent: %s', info.messageId);
    });
  }
};

export default mail;
