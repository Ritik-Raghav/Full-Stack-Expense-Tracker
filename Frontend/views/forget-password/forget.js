const frontendBaseUrl = "http://13.127.242.103";
const backendBaseUrl = "http://13.127.242.103:3000";

const forgetForm = document.querySelector('#forget-form');

forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;

    const obj = {
        email
    };

    try {
        const response = await axios.post(`${backendBaseUrl}/password/forgotpassword`, obj);
        console.log(response);
        alert('Email sent successfully');
        window.location.href = `${frontendBaseUrl}/views/login/login.html`;
    }
    catch(error) {
        console.log(error);
    }
    e.target.reset();
})