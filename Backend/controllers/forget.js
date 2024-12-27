const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const client = Sib.ApiClient.instance;


client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;


const apiInstance = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'ritikrghv313@gmail.com',
    name: 'xyz'
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email }});

        if (user) {
            const id = uuid.v4();
            console.log("ID:", id);
            await user.createForgotpassword({ id : id, active : true});
            await apiInstance.sendTransacEmail({
                sender,
                to: [{ email }],
                subject: "First time sending mail using api",
                textContent: "this place will be used for sending forgotten password",
                htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            })
            console.log("Forgot Password record created successfully");
        }

    }
    catch(error) {
        console.log(error);
        res.send(error.message);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const id =  req.params.id;
        const forgotpasswordrequest = await Forgotpassword.findOne({ where : { id }})
        if(forgotpasswordrequest){
            await forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password: </label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    } catch (err) {
        console.error("Error:", err);
        res.send(err.message);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        const resetpasswordrequest = await Forgotpassword.findOne({ where : { id: resetpasswordid }});
        const user = await User.findOne({ where: { id: resetpasswordrequest.userId }});
        if(user) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(newpassword, salt);
            await user.update({ password: hash });
            res.status(201).json({ message: 'Successfully updated the new password' });
        } else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    } catch(err) {
        console.error("Error:", err);
        res.send(err.message);
    }
}