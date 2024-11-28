

window.addEventListener('DOMContentLoaded', loadData);

const form = document.querySelector('form');
const token = localStorage.getItem('token');
const premiumBtn = document.querySelector('#rzp-button1');
const leaderboardBtn = document.querySelector('#leader-button');
const leaderboardContainer = document.querySelector('.board-container');
const leaderList = document.querySelector('#leader-list');
const fileList = document.querySelector('#file-list');
const downloadBtn = document.querySelector('#download-button');

leaderboardBtn.style.display = 'none';

leaderboardContainer.style.display = 'none';
downloadBtn.style.display = 'none';

downloadBtn.onclick = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.get('http://localhost:3000/premium/downloadExpenses', { headers: {"Authorization" : token} });
        if (response.status === 200) {
            var a = document.createElement('a');
            a.href = response.data.obj.Location;
            a.download = 'myexpense.csv';
            a.click();

            // const fileURL = response.data.obj.Location;
            const fileInfo = response.data.obj;
            const obj = {
                fileInfo
            }

            const postResponse = await axios.post('http://localhost:3000/premium/uploadFiles', obj, { headers: {"Authorization" : token} });
            const data = postResponse.data;
            displayFiles(data);
            console.log(data)
        }
    }
    catch(error) {
        console.log(error);
    }
    
}

function displayFiles(obj) {
    const link = document.createElement('a');
    link.href = obj.fileURL;
    link.textContent = obj.key;
    fileList.appendChild(link);
}

leaderboardBtn.onclick = async (e) => {
    const response = await axios.get('http://localhost:3000/premium/showLeaderBoard');
    const data = response.data;
    
    if (leaderboardContainer.style.display === 'none') {
        displayUserLeaderboard(data);
        leaderboardContainer.style.display = 'block';
    }
    else {
        leaderList.innerHTML = '';
        leaderboardContainer.style.display = 'none';
    }
}

function displayUserLeaderboard(obj) {
    
    for (let i=0; i<obj.length; i++) {
        const user = obj[i];
        const boardItem = document.createElement('li');
        boardItem.className = 'board-item';
        boardItem.textContent = 'Name: ' + user.username + ' ' + '------------' + ' ' + 'Total Cost: ' + user.totalExpenses;
        leaderList.appendChild(boardItem);
    }
}

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

    const text = document.createElement('p');
    text.className = 'float-right'
    text.textContent = 'Premium Member';
    text.style.color = 'green';
    text.style.fontWeight = 'bold'
    const parentElement = document.querySelector('#premium_status');
    parentElement.appendChild(text);

    // Download expense button visibility
    downloadBtn.style.display = 'block';

    // Leaderboard button visibility
    leaderboardBtn.style.display = 'block';
}

function displayExpense(obj) {
    console.log(obj.id)
    const item = document.createElement('p');
    item.textContent = obj.amount + ' - ' + obj.desc + ' - ' + obj.category;
    
    // creating delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-danger float-right';

    delBtn.textContent = 'Delete';

    item.appendChild(delBtn);

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

    const list = document.querySelector('.list-group');
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
        
        // Loading downloaded expenses data
        loadFiles();
    }
    catch(error) {
        console.log(error);
    }
}

async function loadFiles() {
    try {
        const getResponse = await axios.get('http://localhost:3000/premium/uploadFiles', { headers: {"Authorization" : token} });
        const files = getResponse.data;
        files.forEach(file => {
            displayFiles(file);
        });
    }
    catch(error) {
        console.log(error);
    }
}