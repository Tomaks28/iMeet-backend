// Options d'email
export const mailOptions = (subject: string, to: string, html: string) => {
  const options = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    // text: "That was easy!",
    html,
  };
  return options;
};
