const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter using your SMTP settings
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465 ? true : false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        
    });

    // Define email options
    const mailOptions = {
        from: `Expense Tracker <${process.env.EMAIL_USER}>`, // Sender address
        to: options.email, // List of receivers
        subject: options.subject, // Subject line
        html: options.message, // HTML body content
        
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        // Throw the error to be caught by the calling function (e.g., auth.routes.js)
        throw new Error('Failed to send email: ' + error.message);
    }
};

module.exports = sendEmail;