const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlTotext = require('html-to-text');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_APIKEY);

module.exports = class Email {
    constructor(user, url ){
        this.to = user.email;
        this.name = user.name || '';
        this.message = user.message || '';
        this.from = process.env.MAIL_ADMIN
    }

    newTransport(){
        // development settings
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
        })

    }

    //send the actual email
    async send(template, subject) {
        //1. Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            name : this.name,
            message: this.message,
            subject,
        })

        //2. define email options
        const mailOptions = {
            to: this.to,
            from: {
                email: "consultation@qeola.com",
                name: process.env.APP_NAME
            },
            subject,
            text: htmlTotext.fromString(html),
            html,
        }

        //3. create a transport and send email
        try {
            if (process.env.NODE_ENV === 'development') {
                await this.newTransport().sendMail(mailOptions);
            }

            if (process.env.NODE_ENV === 'production') {
                await sgMail.send(mailOptions);
            }
        } catch (err) {
            // console.log(err.response)
            return err;
        }
    }

    async sendTestWelcome(){
        await this.send('testwelcome', 'TSC - Verify your Email Address.')
    }

    async sendWelcome(){
        await this.send('welcome', 'TSC - Verify your Email Address.')
    }

}
