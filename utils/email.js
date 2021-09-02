const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlTotext = require('html-to-text');


module.exports = class Email {
    constructor(user, url ){
        this.from = user.email;
        this.name = user.name || '';
        this.message = user.message || '';
        this.url = url || '';
        this.phone = user.phone || '';
        // this.to = process.env.MAIL_ADMIN
        this.to = 'lystuntest@gmail.com'
    }

    newTransport(){
        // development settings
        // return nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD
        //     },
        // })

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sd.ennovatelab@gmail.com',
                pass: 'SD.elab20'
            }
        })

    }

    //send the actual email
    async send(template, subject){
        //1. Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            name : this.name,
            message: this.message,
            url: this.url,
            phone: this.phone,
            subject,
        })

        //2. define email options
        const mailOptions = {
            to: this.to,
            from: this.from,
            subject,
            text: htmlTotext.fromString(html),
            html,
        }

        //3. create a transport and send email
        try {
            await this.newTransport().sendMail(mailOptions);
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async sendTestWelcome(){
        await this.send('testwelcome', 'TSC - Verify your Email Address.')
    }

    async sendClientBrief(){
        await this.send('clientBrief', 'Prospective Client Acquired.')
    }

}
