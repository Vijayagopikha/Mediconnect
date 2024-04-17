import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vigneshsobalamurugan2005@gmail.com', 
      pass: 'fsum hfnq rlns oyms',
    },
  });


const sendEMail = (name,email,age,address,phone,date,time,dtremail) => {
    const mailOptions = {
      from: 'vigneshsobalamurugan2005@gmail.com',
      to: dtremail,
      subject: 'Appointment',
      text: `Appointment Details,\n
      Patient Name:${name},\n
      E-mail: ${email},\n
      Age:${age},\n
      Address:${address},\n
      Phone:${phone},\n
      Date:${date},\n
      Time:${time}
      `,
    };
   console.log(dtremail);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  export default sendEMail;