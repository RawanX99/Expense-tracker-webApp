
const totalCard=document.getElementById("total-value");
const countCard=document.getElementById("expenses-number");
const API_URL = "http://localhost:3000/api/expenses";
const alertContainer=document.getElementById("alert-container");
const highestValue=document.getElementById("highest-value");
const highestName=document.getElementById("highest-name");
const categoryList=document.querySelectorAll(".form-select");
const addForm=document.getElementById("add-form");
const tableBody=document.getElementById("expenses-table-body");
const categoryFilter=document.getElementById("category-filter");
const editForm=document.getElementById("edit-form");
const editModal=document.getElementById("edit-modal");
const saveButton=document.getElementById("save-edit-button");
const deleteButton=document.getElementById("delete-button");
const deleteModal=document.getElementById("delete-modal");
const loadingOverlay = document.getElementById("loading-overlay");
const searchInput = document.getElementById("searchByTitle");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

const CATEGORIES = ["Food", "Transport","Bills", "Entertainment", "Other"];

function showLoadingOverlay() {
    loadingOverlay.classList.remove("d-none");
}

function hideLoadingOverlay() {
    loadingOverlay.classList.add("d-none");
}

// get all expenses
async function getExpenses(){
    showLoadingOverlay();
    try{
        const response=await fetch(API_URL);
        const data=await response.json();

        if(!response.ok){
            throw new Error(
                data.message || "Failed to Fetch expenses"
            );

        }

        return data;

    }catch(error){
        showAlert(error.message,"danger");
        return null;
    }finally{
        hideLoadingOverlay();
    }

}

let expenses;

async function refresh(){
    expenses=await getExpenses();
    if (!expenses || expenses.length===0) return;
    summaryData();
    applyFilter();

}

refresh();


function showAlert(data,type){
    alertContainer.textContent="";
    const alertBox=document.createElement('div');
    alertBox.className=`alert alert-${type} fade show px-4 d-flex justify-content-between`;
    alertBox.textContent=data;

    const closeBtn=document.createElement("button");
    closeBtn.className="btn-close";
    closeBtn.setAttribute("data-bs-dismiss","alert");

    alertContainer.appendChild(alertBox);
    alertBox.appendChild(closeBtn);
}


async function  summaryData(){

    const total=expenses.reduce((sum,expense)=>sum+expense.amount,0);
    
    const count=expenses.length;

    const highestExpense=expenses.reduce((highest,expense)=>{
        return Number(expense.amount)>Number(highest.amount)?expense:highest;
    });
    

    totalCard.textContent=`${total.toFixed(2)}`;
    countCard.textContent=`${count}`;
    highestValue.textContent=`${highestExpense.amount}`;
    highestName.textContent=`${highestExpense.title}`;



}



function getCategoryOptions(){

    categoryList.forEach(select => {
        CATEGORIES.forEach(category=>{

            const option=document.createElement("option");
            option.setAttribute("value",category);
            option.textContent=category;

            select.appendChild(option);
        });
    })

};

getCategoryOptions();



function validateForm(form){
    

    const titleField=form.elements.title;
    const amountField=form.elements.amount;
    const categoryField=form.elements.category;
    const dateField=form.elements.date;


    removeError(titleField,amountField,categoryField,dateField);

    let isValid=true;

    if(!titleField.value.trim()){
        showFieldAlert(titleField,"Title is required.");
        isValid=false;
    }

    if(!amountField.value || Number.isNaN(Number(amountField.value)) || Number(amountField.value) <=0 ){
        showFieldAlert(amountField,"Enter an amount greater than 0.");
        isValid=false;
    }

    if(!categoryField.value || !CATEGORIES.includes(categoryField.value)){
        showFieldAlert(categoryField,"Choose a category");
        isValid=false;
    }

    if(!dateField.value){
        showFieldAlert(dateField,"Date is required.");
        isValid=false;
    }

    if(!isValid) return null;

    return {
        title: titleField.value.trim(),
        amount: Number(amountField.value),
        category: categoryField.value,
        date: dateField.value
    };

}




function showFieldAlert(field,message){
    field.classList.add("is-invalid");
    const feedback=field.parentElement.querySelector(".invalid-feedback");
    feedback.textContent=message;
}


addForm.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const data=validateForm(addForm);


    if(!data) return;
    showLoadingOverlay();        
        try{
        const response=await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message || "Failed to add expense"
            );
        }

        addForm.reset();
        await refresh();
        showAlert("Expense added.", "success");

        }catch(error){
            showAlert(error.message,"danger");
        }finally{
            hideLoadingOverlay();
        }

});


function removeError(...list){
    list.forEach(field=>{
        field.classList.remove("is-invalid");
        const feedback=field.parentElement.querySelector(
                ".invalid-feedback"
            );

        if (feedback) {
            feedback.textContent = "";
        }
    })
}


async function applyFilter(){

    const selectedCategory=categoryFilter.value;
    const searchedTitle=searchInput.value.trim().toLowerCase();

    const filteredList=expenses.filter(expense => {
        return (expense.category ===selectedCategory || selectedCategory === "All") && expense.title.toLowerCase().includes(searchedTitle);
    });

    renderTable(filteredList);



}

categoryFilter.addEventListener("change",applyFilter);


async function renderTable(list) {

    tableBody.innerHTML="";

    if(list.length ===0){
        const row=document.createElement("tr");
        const cell=document.createElement("td");
        cell.colSpan=5;
        cell.textContent="No expenses found.";
        cell.className="text-center";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    list.forEach(expense => {

        const row=document.createElement("tr");
        const titleCell=document.createElement("th");
        titleCell.textContent=expense.title;

        const amountCell=document.createElement("td");
        amountCell.textContent=Number(expense.amount);

        const categoryCell=document.createElement("td");
        const badge=document.createElement("span");
        badge.className="badge"
        switch(expense.category){
            case "Food":
                badge.classList.add("text-bg-success");
                break;
            case "Transport":
                badge.classList.add("text-bg-primary");
                break;
            case "Bills":
                badge.classList.add("text-bg-warning");
                break;
            case "Entertainment":
                badge.classList.add("text-bg-info");
                break;
            case "Other":
                badge.classList.add("text-bg-secondary");
                break;
        }

        badge.textContent=expense.category;
        categoryCell.appendChild(badge);

        const dateCell=document.createElement("td");
        dateCell.textContent=expense.date;

        const actionsCell=document.createElement("td");
        const editBtn=document.createElement("button");
        const deleteBtn=document.createElement("button");

        editBtn.className="btn btn-sm btn-outline-secondary edit-button";
        deleteBtn.className="btn btn-sm btn-outline-danger delete-button";

        editBtn.textContent="Edit";
        deleteBtn.textContent="Delete";

        editBtn.setAttribute("data-bs-toggle","modal");
        editBtn.setAttribute("data-bs-target","#edit-modal");
        editBtn.dataset.id=expense.id;

        deleteBtn.setAttribute("data-bs-toggle","modal");
        deleteBtn.setAttribute("data-bs-target","#delete-modal");
        deleteBtn.dataset.id=expense.id;

        actionsCell.append(editBtn,deleteBtn);

        

        tableBody.appendChild(row);
        row.append(titleCell,amountCell,categoryCell,dateCell,actionsCell);


    });
}



editModal.addEventListener("show.bs.modal",(event)=>{
    const id=event.relatedTarget.dataset.id;
    const expense=expenses.find(expense=>expense.id==Number(id));

    if(!expense) return;

    removeError(
        editForm.elements.title,
        editForm.elements.amount,
        editForm.elements.category,
        editForm.elements.date
    );

    editForm.dataset.id=expense.id;
    editForm.elements.title.value=expense.title;
    editForm.elements.amount.value=expense.amount;
    editForm.elements.category.value=expense.category;
    editForm.elements.date.value=expense.date;


});

deleteModal.addEventListener("show.bs.modal", (event) => {
    deleteButton.dataset.id = event.relatedTarget.dataset.id;
});

saveButton.addEventListener("click",async ()=>{ 
    
    const data=validateForm(editForm);
    if(!data) return;

    const id=editForm.dataset.id;
    showLoadingOverlay();

    try{
        const response=await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message || "Failed to update expense"
            );
        }

        await refresh();
        showAlert("Expense updated.","success");
    }catch(error){
        showAlert(error.message,"danger");
    }finally{
        bootstrap.Modal.getInstance(editModal).hide();
        hideLoadingOverlay();
    }

});

deleteButton.addEventListener("click",async ()=>{
    const id=deleteButton.dataset.id;
    showLoadingOverlay();
    try{
        const response=await fetch(`${API_URL}/${id}`,{
            method:"DELETE"
        });

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message || "Failed to delete expense"
            );
        }

        await refresh();
        showAlert("Expense deleted.","success");

    }catch(error){
        showAlert(error.message,"danger");
    }finally{
        bootstrap.Modal.getOrCreateInstance(deleteModal).hide();
        hideLoadingOverlay();
    }

});

// Bonus

searchInput.addEventListener("input",applyFilter);

if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    themeIcon.className = "bi bi-moon-fill";
}

themeToggle.addEventListener("click",()=>{

    const htmlElement=document.documentElement;

    if(htmlElement.getAttribute("data-bs-theme")==="dark"){
        htmlElement.setAttribute("data-bs-theme","light");
        themeIcon.className = "bi bi-sun-fill";
        localStorage.setItem("theme","light");
        return;
    }

    htmlElement.setAttribute("data-bs-theme","dark");
    themeIcon.className = "bi bi-moon-fill";
    localStorage.setItem("theme","dark");
});