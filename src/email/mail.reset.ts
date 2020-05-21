import { resetHtml, transporter, mailOptions } from ".";

export const sendResetEmail = (to: string) => {
  // Options d'email
  const options = mailOptions("Mot de passe oublié", to, resetHtml());
  // Envoi du mail
  // **NOTE** Pour envoyer des mails. Allez dans google et autoriser 'Accès moins sécurisé des applications'
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return { success: false, message: error };
    } else {
      return { success: true, message: info.response };
    }
  });
};
