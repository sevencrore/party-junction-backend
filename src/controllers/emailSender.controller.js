const nodemailer = require('nodemailer');
const path = require('path');

// Configure your email transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

        
    }
});

// Function to send email with optional attachments
const sendEmail = async ({ to, subject, htmlContent, attachments = [] }) => {
    try {
        console.log("Email User:", process.env.EMAIL_USER);
        console.log("Email Pass:", process.env.EMAIL_PASS);
        console.log(to);
        

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
            attachments // Array of attachment objects
        };
            
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
