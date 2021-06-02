const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harshudai2001@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const securityM = (email,text)=>{
    sgMail.send({
        to:email,
        from: 'harshudai2001@gmail.com',
        subject: 'This is yours Security token',
        text: `Security Token:- ${text}`
    })
}

const cancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harshudai2001@gmail.com',
        subject: 'Sorry so to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.` 
    })
}

const approveEmail = (email,name,rsName)=>{
    sgMail.send({
        to:email,
        from :'harshudai2001@gmail.com',
        subject: 'Approved Resource',
        text:`Congratulations ${name}. Your Request for the Resource Name: ${rsName} is approved. Try to communicate with resource owner :) `
    })
}

const accountDelete = (email)=>{
    sgMail.send({
        to:email,
        from: 'harshudai2001@gmail.com',
        subject : 'Account Deleted',
        text: `Hello ${email}, your account has been suspended becuase we have found some unusal content from your account.`
    })
}

module.exports={
    sendWelcomeEmail,
    cancelEmail,
    securityM,
    approveEmail,
    accountDelete
}