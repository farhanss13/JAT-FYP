const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendEmail = async (to, subject, html) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const email = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "Job Tracker",
      },
      to: [{ email: to, name: "User" }],
      subject: subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(email);

    console.log("Email sent:", response);
  } catch (error) {
    console.log("Brevo Error:", error.response?.body || error.message);
  }
};

module.exports = sendEmail;