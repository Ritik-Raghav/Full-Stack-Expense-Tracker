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
        const response = await axios.post('http://localhost:3000/signup/user', userObj);
        const user = response.data;
        console.log(user)
    }
    catch(error) {
        console.log(error);
        alert('User already exists!');
    }

    event.target.reset();
})