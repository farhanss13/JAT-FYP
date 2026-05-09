const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_USER, 
        name: "Job Tracker",
      },
      to: [{ email: to }],
      subject,
      htmlContent: `<p>${htmlContent}</p>`,
    });

    console.log("Email sent:", response.messageId);
  } catch (error) {
    console.log("Email error:", error.response?.text || error.message);
  }
};
