const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;

// const apikey = client.authentications['api-key'];
// apikey.apikey = process.env.BREVO_API_KEY;

client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;


const apiInstance = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'ritikrghv313@gmail.com',
    name: 'xyz'
}

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);

        const response = await apiInstance.sendTransacEmail({
            sender,
            to: [{ email }],
            subject: "first time sending mail using api",
            textContent: "this place will be used for sending forgotten password",
            htmlContent: `<h1>GOOGLE</h1>
            <a href="https://www.google.com">VISIT</a>`,
            params: {
                role: 'Frontend'
            }
        });

        console.log('Email sent successfully:', response);
        res.status(200).json({ message: 'Email sent successfully!' });

    }
    catch(error) {
        console.log(error);
        res.send(error.message);
    }
}