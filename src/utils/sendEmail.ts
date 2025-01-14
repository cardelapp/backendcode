
import { transporter } from "./emailConfig";

export const sendEmailPassword = async (
  to: string,
  subject: string = '',
  email: string = '',
  htmltemplate: (value: string) => string // Correct typing for the htmltemplate function
): Promise<{ success: boolean; message: string }> => {
  try {
    const htmlContent = htmltemplate('123'); // Example: Pass a value to generate the HTML content
    const mailOptions = {
      from: 'miresumiresume@gmail.com',
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email.' };
  }
};
