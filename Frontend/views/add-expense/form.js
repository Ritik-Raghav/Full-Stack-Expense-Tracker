const frontendBaseUrl = "http://13.127.242.103";
const backendBaseUrl = "http://13.127.242.103:3000";

window.addEventListener('DOMContentLoaded', () => {
    fetchItems(currentPage);
    loadData();
});

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
        const response = await axios.get(`${backendBaseUrl}/premium/downloadExpenses`, { headers: {"Authorization" : token} });
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

            const postResponse = await axios.post(`${backendBaseUrl}/premium/uploadFiles`, obj, { headers: {"Authorization" : token} });
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
    const response = await axios.get(`${backendBaseUrl}/premium/showLeaderBoard`);
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
   const response = await axios.get(`${backendBaseUrl}/purchase/premiummembership`, { headers: {"Authorization" : token}});
   console.log(response);
   var options = {
    'key': response.data.key_id,
    'order_id': response.data.order.id,
    // This handler function handle the successfull payment
    "handler": async function (response) {
        await axios.post(`${backendBaseUrl}/purchase/updatetransactionstatus`, {
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
    await axios.post(`${backendBaseUrl}/purchase/marktransactionfailed`, {
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
        const response = await axios.post(`${backendBaseUrl}/expense/addExpense`, obj, { headers: {"Authorization" : token}});
        const data = response.data;
        displayExpense(data);
        fetchItems(currentPage)
    }
    catch(error) {
        console.log(error);
    }
    
    event.target.reset();
});

async function premiumStatus() {
    const response = await axios.get(`${backendBaseUrl}/expense/getUser`, { headers: {"Authorization" : token}});
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
    // Create a new list item for the expense
    const item = document.createElement('li');
    item.id = `expense-${obj.id}`;
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.textContent = `${obj.amount} - ${obj.desc} - ${obj.category}`;

    // Create the delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-danger';
    delBtn.textContent = 'Delete';

    // Attach delete functionality to the button
    delBtn.onclick = async () => {
        try {
            await axios.delete(`${backendBaseUrl}/expense/delete/${obj.id}`, {
                headers: { "Authorization": token }
            });
            item.remove(); // Remove the item from the list upon successful deletion
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Append the delete button to the list item
    item.appendChild(delBtn);

    // Add the new item to the expense list
    const list = document.querySelector('.list-group');
    list.appendChild(item);
}



async function loadData() {
    try {
        // const response = await axios.get('http://localhost:3000/expense/addExpense', { headers: {"Authorization" : token}});
        // const data = response.data;
        // data.forEach(expense => {
        //     displayExpense(expense);
        // })
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
        const getResponse = await axios.get(`${backendBaseUrl}/premium/uploadFiles`, { headers: {"Authorization" : token} });
        const files = getResponse.data;
        files.forEach(file => {
            displayFiles(file);
        });
    }
    catch(error) {
        console.log(error);
    }
}

//----------------------------------

const itemsContainer = document.getElementById('itemsContainer');
const currentPageElement = document.getElementById('currentPage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 1;
let size = 5; // Number of items per page

// Function to fetch and render items
async function fetchItems(page) {
    try {
        const response = await axios.get(`${backendBaseUrl}/expense/items?page=${page}&size=${size}`, {
            headers: { "Authorization": token }
        });

        const data = response.data;

        // Clear the existing list items
        const list = document.querySelector('.list-group');
        list.innerHTML = '';

        // Render new items for the current page
        data.items.forEach(item => {
            displayExpense(item);
        });

        // Update pagination info
        currentPage = data.currentPage;
        currentPageElement.textContent = currentPage;

        // Disable/Enable buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === data.totalPages;

        // Render pagination buttons
        renderPagination(data.totalPages);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}


// Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchItems(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    fetchItems(currentPage + 1);
});

// Function to render pagination buttons (if necessary)
function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.disabled = i === currentPage;

        pageButton.addEventListener('click', () => {
            fetchItems(i);
        });

        paginationDiv.appendChild(pageButton);
    }
}   


const rowsNum = document.querySelector('#rows-num');
rowsNum.addEventListener('change', (e) => {
    const num = e.target.value;
    size = num;
    fetchItems(currentPage)
})
