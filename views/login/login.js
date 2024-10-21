const form = document.querySelector('#signup-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    
    const email = event.target.email.value;
    const password = event.target.password.value;

    const userObj = {
        email,
        password
    }

    try {
        const response = await axios.post('http://localhost:3000/login/user', userObj);
        const user = response.data;
        alert('User logged in successfully');
        window.location.href = "http://localhost:5500/views/add-expense/form.html"
    }
    catch(error) {
        console.log(error);
        alert(error.response.data.message);
    }

    event.target.reset();
})