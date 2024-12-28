const frontendBaseUrl = "http://13.127.242.103";
const backendBaseUrl = "http://13.127.242.103:3000";

const form = document.querySelector('#signup-form');
const loginContainer = document.querySelector('#login-container');
const forgetBtn = document.querySelector('#forget-btn');

forgetBtn.onclick = (e) => {
    window.location.href = `${baseUrl.frontendBaseUrl}/views/forget-password/forget.html`;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    
    const email = event.target.email.value;
    const password = event.target.password.value;

    const userObj = {
        email,
        password
    }

    try {
        const response = await axios.post(`${backendBaseUrl}/login/user`, userObj);
        const user = response.data;
        console.log(user.token);
        localStorage.setItem('token', user.token);
        alert('User logged in successfully');
        window.location.href = `${frontendBaseUrl}/views/add-expense/form.html`
    }
    catch(error) {
        console.log(error);
        alert(error.response.data.message);
    }

    event.target.reset();
})
