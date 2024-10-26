

window.addEventListener('DOMContentLoaded', loadData);

const form = document.querySelector('form');
const token = localStorage.getItem('token');
const premiumBtn = document.querySelector('#rzp-button1');

premiumBtn.onclick = async (e) => {
   const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token}});
   console.log(response);
   var options = {
    'key': response.data.key_id,
    'order_id': response.data.order.id,
    // This handler function handle the successfull payment
    "handler": async function (response) {
        await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, { headers: {"Authorization" : token} });

        alert('You are a Premium User Now');
        premiumChanges();
    }
   };
   const rzp1 = new Razorpay(options);
   rzp1.open();
   e.preventDefault();
   

   rzp1.on('payment.failed', async function (response) {
    console.log(response);
    await axios.post('http://localhost:3000/purchase/marktransactionfailed', {
            order_id: options.order_id,
        }, { headers: { "Authorization": token } });
    alert('Payment failed please try again');
   });

}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    const desc = event.target.desc.value;
    const category = event.target.category.value;

    const obj = {
        amount, 
        desc,
        category
    }

    try {
        const response = await axios.post('http://localhost:3000/expense/addExpense', obj, { headers: {"Authorization" : token}});
        const data = response.data;
        displayExpense(data);
    }
    catch(error) {
        console.log(error);
    }
    
    event.target.reset();
});

async function premiumStatus() {
    const response = await axios.get('http://localhost:3000/expense/getUser', { headers: {"Authorization" : token}});
    const premiumStatus = response.data.premiumStatus;
    if (premiumStatus) {
        premiumChanges();
    }
}

function premiumChanges() {
    premiumBtn.style.display = 'none';

    const text = document.createElement('h5');
    text.className = 'float-right'
    text.textContent = 'You are a Premium Member';
    text.style.color = 'green';
    const parentElement = document.querySelector('#premium_status');
    parentElement.appendChild(text);
}

function displayExpense(obj) {
    console.log(obj.id)
    const item = document.createElement('p');
    item.textContent = obj.amount + ' - ' + obj.desc + ' - ' + obj.category;
    
    // creating delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-danger float-right';

    // const editBtn = document.createElement('button');
    // editBtn.className = 'btn btn-sm btn-warning float-right ml-2';

    delBtn.textContent = 'Delete';
    // editBtn.textContent = 'Edit';

    item.appendChild(delBtn);
    // item.appendChild(editBtn);

    // adding delete functionality
    delBtn.onclick = async (event) => {
        try {
            const response = await axios.delete(`http://localhost:3000/expense/delete/${obj.id}`);
            list.removeChild(event.target.parentElement);
        }
        catch(error) {
            console.log(error);
        }
        
    }

    const list = document.querySelector('ul');
    list.appendChild(item);
}

async function loadData() {
    try {
        const response = await axios.get('http://localhost:3000/expense/addExpense', { headers: {"Authorization" : token}});
        const data = response.data;
        data.forEach(expense => {
            displayExpense(expense);
        })
        premiumStatus();
    }
    catch(error) {
        console.log(error);
    }
}