

window.addEventListener('DOMContentLoaded', loadData);

const form = document.querySelector('form');
const token = localStorage.getItem('token');

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
        console.log(data);
        displayExpense(data);
    }
    catch(error) {
        console.log(error);
    }
    
    event.target.reset();
});

function displayExpense(obj) {
    console.log(obj.id)
    const item = document.createElement('h5');
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
    }
    catch(error) {
        console.log(error);
    }
}