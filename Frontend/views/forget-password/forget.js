import baseUrl from "../index";

const forgetForm = document.querySelector('#forget-form');

forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;

    const obj = {
        email
    };

    try {
        const response = await axios.post(`${baseUrl.backendBaseUrl}/password/forgotpassword`, obj);
        console.log(response);
        alert('Email sent successfully');
        window.location.href = `${baseUrl.frontendBaseUrl}/views/login/login.html`;
    }
    catch(error) {
        console.log(error);
    }
    e.target.reset();
})