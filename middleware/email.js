const nodemailer = require('nodemailer');


// email(userId, password, to, subject, template, text)
const email = (to, subject, template, text) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: process.env.emailHost,
            port: 465,
            secure: true, // true for 465, false for other ports
            // service: 'gmail',
            auth: {
                user: process.env.emailID,
                pass: process.env.emailPassword
            }
        });
    
        const mailOptions = {
            from: process.env.emailID,
            to: to,
            subject: subject,
            text: text,
            html: template, // html body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    })
    
}

module.exports = email;