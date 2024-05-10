const buyPremiumButton = document.getElementById("buyPremiumButton");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

buyPremiumButton.onclick = async function (e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:5800/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:5800/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert(
        "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
      );
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
};
async function addExpense(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const token = localStorage.getItem("token");
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // add leading zeros to day and month if needed
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // create the date string in date-month-year format
  const date = `${formattedDay}-${formattedMonth}-${year}`;
  const expenseData = {
    date,
    amount,
    description,
    category,
    token,
  };
  try {
    const result = await axios.post(
      "http://localhost:5800/expense/addExpense",
      expenseData,
      { headers: { Authorization: token } }
    );
    console.log(result);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function getAllExpenses() {
  try {
    const data = await axios.get(
      "http://localhost:5800/expense/getAllExpenses"
    );
    showItems(data.data.result);
    console.log(data.data.result);
  } catch (err) {
    console.log(err);
  }
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5800/user/isPremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.isPremiumUser) {
    buyPremiumButton.innerHTML = "Premium Member &#9889";
    reportsLink.innerHTML = "Report &#9889";
    //reportsLink.removeAttribute("onclick");
    leaderboardLink.innerHTML = "Leaderboard &#9889";
    //leaderboardLink.removeAttribute("onclick");
    // leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    // reportsLink.setAttribute("href", "/reports/getReportsPage");
    buyPremiumButton.removeEventListener("click", buyPremiumButton);
  } else {
    //do nothing
  }
}

function showItems(data) {
  const tableBody = document.getElementById("list-items");
  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = `${index + 1}`;
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    td1.innerHTML = `<span class="badge bg-primary rounded-pill">${item.amount} &#8377</span>`;
    td2.innerHTML = `${item.description}`;
    td3.innerHTML = `<div> <button class='btn btn-danger' onclick=deleteItem(${item.id})>Delete</button>  <button class='btn btn-dark'>Edit</button></div>`;
    // li.classList.add('list-group-item')
    // li.innerHTML = `<span class="badge bg-primary rounded-pill">${item.amount} &#8377</span> ${item.description} <div> <button class='btn btn-danger' onclick=deleteItem(${item.id})>Delete</button>  <button class='btn btn-dark'>Edit</button></div>`;
    // list.append(li);
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tableBody.appendChild(tr);
  });
}

async function deleteItem(id) {
  try {
    const result = await axios.delete(
      `http://localhost:5800/expense/delete/${id}`
    );
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

getAllExpenses();

async function getLeaderBoardData() {
  try {
    const result = axios.get(
      "http://localhost:5800/premium/getLeaderBoardData"
    );
    const data = await result;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function getExpenses() {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.get(
      "http://localhost:5800/expense/downloadExpenses",
      {
        headers: { Authorization: token },
      }
    );
    let a = document.createElement("a");
    a.href = `${result.data.fileURL}`;
    a.download = "expense.txt";
    a.click();
  } catch (err) {
    console.log(err);
  }
}
reportsLink.addEventListener("click", getExpenses);

document.addEventListener("DOMContentLoaded", isPremiumUser);
logoutBtn.addEventListener("click", logout);
