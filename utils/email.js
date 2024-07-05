const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const sendEmail = async ( anotherPerson, subj, message ) => {
    const info = await transporter.sendMail({
        from: 'Masar Academy',
        to: `${anotherPerson}`,
        subject : subj,
        text: message,
        // html: content,
    });
}

module.exports = sendEmail;