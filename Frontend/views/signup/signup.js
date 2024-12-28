const frontendBaseUrl = "http://13.127.242.103";
const backendBaseUrl = "http://13.127.242.103:3000";

const form = document.querySelector('#signup-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const userObj = {
        username,
        email,
        password
    }

    try {
        const response = await axios.post(`${backendBaseUrl}/signup/user`, userObj);
        const user = response.data;
        alert('User signed up successfully');
        window.location.href = `${frontendBaseUrl}/login/login.html`
        console.log(user)
    }
    catch(error) {
        console.log(error);
        alert('User already exists!');
    }

    event.target.reset();
})