const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nikhil.saroj.bansal@gmail.com",
    pass: "",
  },
});

const mailOptions = {
  from: "nikhil.saroj.bansal@gmail.com",
  to: "nikhil.nicks.nb@gmail.com, nikhilbansal@mentissoft.com",
  subject: "asd fasd",
  text: `Dear Candidate,dsafasdfasdfasdfasd`,
  html: `asfdasdfasd`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error occurred:", error);
  }
  console.log("Email sent:", info.response);
});
