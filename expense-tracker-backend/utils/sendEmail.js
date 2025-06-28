// -- expense-tracker-backend\utils\sendEmail.js --

const nodemailer = require('nodemailer');

// It's good practice to load environment variables where they are used or globally in server.js
// For a utility, ensure process.env variables are accessible.
// Consider adding your EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT to your .env file
// Example .env entries:
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=your_email@gmail.com
// EMAIL_PASS=your_email_app_password_or_password

const sendEmail = async (options) => {
    // 1. Create a transporter using your SMTP settings
    // You'll need to set up an app password if using Gmail with 2FA
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465 ? true : false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Optional: for development, you might want to accept self-signed certs
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // 2. Define email options
    const mailOptions = {
        from: `Expense Tracker <${process.env.EMAIL_USER}>`, // Sender address
        to: options.email, // List of receivers
        subject: options.subject, // Subject line
        html: options.message, // HTML body content
        // text: options.message, // Plain text body if HTML is not supported
    };

    // 3. Send the email
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