const forgetForm = document.querySelector('#forget-form');

forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;

    const obj = {
        email
    };

    try {
        const response = await axios.post('http://localhost:3000/password/forgotpassword', obj);
        console.log(response);
        alert('Email sent successfully');
        window.location.href = "http://127.0.0.1:5500/views/login/login.html";
    }
    catch(error) {
        console.log(error);
    }
})