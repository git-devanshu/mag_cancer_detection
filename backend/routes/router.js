// reportsController.js
const nodemailer = require("nodemailer");
const express = require('express');
require('dotenv').config();

const router = express.Router();

router.post('/send-report', async (req, res) => {
    try {
      const { doctorEmail, htmlReport } = req.body;
  
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,               
        secure: true,            
        auth: {
          user: process.env.USER,  
          pass: process.env.PASS, 
        },
      });

      let mailOptions = {
        from: "Medical Report",
        to: doctorEmail,
        subject: "New Medical Report",
        html: htmlReport,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      res.status(200).json({ message: "Report sent successfully" });
    } 
    catch (error) {
      console.error("Error sending report:", error);
      res.status(500).json({ error: "Failed to send report" });
    }
});

module.exports = {
  router
};
