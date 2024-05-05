async function addExpense(event){
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const token = localStorage.getItem("token");
    const expenseData={
        amount,
        description,
        category,
        token
    }
    try{
        const result= await axios.post('http://localhost:5800/expense/addExpense',expenseData, {headers: { Authorization: token }});
        console.log(result)
    }
    catch(err){
        console.log(err);
    }
}

async function getAllExpenses(){
    try{
        const data= await axios.get('http://localhost:5800/expense/getAllExpenses');
        showItems(data.data.result)
        console.log(data.data.result);
    }catch(err){
        console.log(err)
    }
}

function showItems(data){
    const list= document.getElementById('list-items');
    data.forEach(item => {
        const li= document.createElement('li');
        li.innerHTML=`${item.amount}  ${item.description} <button onclick=deleteItem(${item.id})>Delete</button>  <button>Edit</button>`
        list.append(li)
    });
}

async function deleteItem(id){
    try{
        console.log(id)
        const result = await axios.delete(`http://localhost:5800/expense/delete/${id}`)
        console.log(result)
    }catch(err){
        console.log(err)
    }
}


getAllExpenses();