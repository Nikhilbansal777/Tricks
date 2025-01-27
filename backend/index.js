const nodemailer = require("nodemailer");
const fs = require("fs");
const xlsx = require("xlsx");
const pdfParse = require("pdf-parse");

const emailHeaders = [
  "email",
  "Email",
  "E-mail",
  "E-Mail",
  "email_address",
  "Email_Address",
  "email id",
  "email address",
  "Email Address",
  "eMail",
  "e_mail",
  "Mail",
  "mail_id",
  "Mail Id",
  "Mail_ID",
  "emailId",
  "EmailID",
  "Email Id",
  "Contact Email",
  "Contact_Email",
  "Primary Email",
  "Work Email",
  "Personal Email",
  "Official Email",
  "HR mail",
  "HR Mail",
  "HR_mail",
];

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function getEmailListFromExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data
    .map((row) => {
      for (const header of emailHeaders) {
        if (row[header]) {
          return row[header];
        }
      }
      return null;
    })
    .filter((email) => email && isValidEmail(email));
}

function getEmailFromTextFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return data.split(/[\s,]+/).filter((email) => isValidEmail(email));
}

function extractEmailsFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  return pdfParse(dataBuffer)
    .then((data) => {
      const text = data.text;
      return (
        text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
      ).filter(isValidEmail);
    })
    .catch((err) => {
      console.error("Error parsing PDF:", err);
      return [];
    });
}

function sendEmails(emailList) {
  if (emailList.length === 0) {
    console.log("No valid emails found.");
    return;
  }
  console.log("Email List:", emailList.join(","));
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nikhil.saroj.bansal@gmail.com",
      pass: "jfzj zmqp stxe cdjh",
    },
  });

  const mailOptions = {
    from: "nikhil.saroj.bansal@gmail.com",
    to: emailList.join(","),
    subject: "asd fasd",
    text: `Dear Candidate,dsafasdfasdfasdfasd`,
    html: `asfdasdfasd`,
    attachments: [
      {
        filename: "Nikhil_Bansal_resume.pdf",
        path: "../Nikhil_Bansal_resume.pdf",
      },
      {
        filename: "Nikhil_Bansal.pdf",
        path: "../Nikhil_Bansal.pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Email sent:", info.response);
  });
}

async function getFinalEmailListFromAnyFiles(filePath) {
  const fileExtension = filePath.split(".").pop().toLowerCase();
  let emailList = [];
  if (fileExtension === "xlsx" || fileExtension === "xls") {
    emailList = getEmailListFromExcelFile(filePath);
  } else if (fileExtension === "txt") {
    emailList = getEmailFromTextFile(filePath);
  } else if (fileExtension === "pdf") {
    emailList = await extractEmailsFromPdf(filePath);
  } else {
    console.error("Unsupported file type:", fileExtension);
    return;
  }
  sendEmails(emailList);
}

const filePath = "../emails.xlsx";
getFinalEmailListFromAnyFiles(filePath);
