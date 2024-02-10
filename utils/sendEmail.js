const nodemailer  = require ('nodemailer'); 
const {USER, PASSWORD} = process.env; 
console.log (USER, PASSWORD)
const sendMail = async (email, mailSubject, content) =>{
    try{
        const transport = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            requireTLS: true, 
            auth: {
                user: USER, 
                pass: PASSWORD 
            }
        });

        const mailOptions = {
            from: USER, 
            to: email,
            subject: mailSubject,
            html: content
        }

        transport.sendMail (mailOptions, (error, info)=>{
            if (error){
                console.log (error); 
            }
            else {
                console.log (`success ${info.response}`)
            }
        })

    }
    catch(err){

    }

}
module.exports = sendMail; 