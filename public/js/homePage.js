const buyPremiumButton = document.getElementById("buyPremiumButton");
const reportsLink= document.getElementById('reportsLink')
const leaderboardLink= document.getElementById('leaderboardLink')
const logoutBtn= document.getElementById('logoutBtn')

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
  const expenseData = {
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
  console.log(res)
  if (res.data.isPremiumUser) {
    buyPremiumButton.innerHTML = "Premium Member &#9889";
    reportsLink.innerHTML="Report &#9889"
    reportsLink.removeAttribute("onclick");
    leaderboardLink.innerHTML="Leaderboard &#9889"
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    reportsLink.setAttribute("href", "/reports/getReportsPage");
    buyPremiumButton.removeEventListener("click", buyPremiumButton);
  } else {
  }
}

function showItems(data) {
  const list = document.getElementById("list-items");
  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.amount}  ${item.description} <button onclick=deleteItem(${item.id})>Delete</button>  <button>Edit</button>`;
    list.append(li);
  });
}

async function deleteItem(id) {
  try {
    console.log(id);
    const result = await axios.delete(
      `http://localhost:5800/expense/delete/${id}`
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

getAllExpenses();


document.addEventListener("DOMContentLoaded", isPremiumUser);
logoutBtn.addEventListener("click", logout);