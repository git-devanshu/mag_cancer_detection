const nodemailer = require('nodemailer');
require('dotenv').config();

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service : 'Gmail',
    secure : false,
    auth : {
        user : process.env.USER,
        pass : process.env.PASS
    }
});

// send registration mails
const sendSignupMail = (emailid, name)=>{
    try{
        const info = transporter.sendMail({
            from : process.env.USER,
            to : emailid,
            subject : 'Registration Successful',
            text : `
Dear ${name},
Your registration at the SmartFolio is successful.
You can now create and manage your portfolio by using the tools provided.
Use your registered username and password to login each time.

Thankyou...
Team4Real`
        });
        console.log("Signup email sent to : ", name);
    }
    catch(error){
        console.log("Error sending signup email", error);
    }
};

// send verification code to reset password
const sendVFCodeMail = (emailid, vfcode)=>{
    try{
        const info = transporter.sendMail({
            from : process.env.USER,
            to : emailid,
            subject : 'Reset Password',
            text : `
A request to reset the password for your SmartFolio account was initiated. 
Use the following verification code to reset your password.

${vfcode}

Thankyou...
Team4Real`
        });
        console.log("Verification code email sent");
    }
    catch(error){
        console.log("Error sending signup email", error);
    }
}

// send records to doctor
const sendMessageMail = (name, email, messageText, receiver) => {
    try{
        const info = transporter.sendMail({
            from : process.env.USER,
            to : receiver,
            subject : 'A new message',
            text : `
Name : ${name}
Email : ${email}

Message : ${messageText}

Thankyou...
Team4Real`
        });
        console.log("Message email sent");
    }
    catch(error){
        console.log("Error sending message email", error);
    }
}

module.exports = {
    sendSignupMail,
    sendVFCodeMail,
    sendMessageMail
}