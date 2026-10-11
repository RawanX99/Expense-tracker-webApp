
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
const lineChart=document.getElementById("line-chart");
const pieChart=document.getElementById("pie-chart");
const yearSelect=document.getElementById("year-select");
const csvButton=document.getElementById("export-csv");
const xlsxButton=document.getElementById('export-xlsx');

const CATEGORIES = ["Food", "Transport","Bills", "Entertainment", "Other"];
let expenses;
let lineChartInstance;
let pieChartInstance;
let categoryTotals = null;
let currentExpenses=[];

let isDark = document.documentElement.getAttribute("data-bs-theme") === "dark";


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
        showAlert(error instanceof TypeError? "Failed to Fetch expenses":error.message,"danger");
        return null;
    }finally{
        hideLoadingOverlay();
    }

}


async function refresh(){
    expenses=await getExpenses();
    if(!expenses)return;
    if (expenses.length===0)showAlert("no expenses Found","warning");
    summaryData();
    applyFilter();
    getYearOptions();
    categoryTotals = await groupExpensesByCategory();
    if (categoryTotals) getPieChart(categoryTotals);


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
        return expense.amount>highest.amount?expense:highest;
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
        showAlert(`${result.title} expense added successfully!.`, "success");

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
    currentExpenses=filteredList;
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
    
    if (!editForm.reportValidity()) return;

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
        showAlert(`${result.title} expense updated successfully!.`,"success");
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
        showAlert(`${result.title} expense deleted successfully!.`,"success");

    }catch(error){
        showAlert(error.message,"danger");
    }finally{
        bootstrap.Modal.getOrCreateInstance(deleteModal).hide();
        hideLoadingOverlay();
    }

});

// Bonus

searchInput.addEventListener("input",applyFilter);

if (isDark) {
    themeIcon.className = "bi bi-moon-fill";
}

themeToggle.addEventListener("click",()=>{

    const htmlElement=document.documentElement;
    isDark=!isDark;

    htmlElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
    themeIcon.className = isDark ? "bi bi-moon-fill" : "bi bi-sun-fill";
    localStorage.setItem("theme", isDark ? "dark" : "light");

    lineChartInstance.destroy();
    lineChartInstance=null;
    getLineChart(yearSelect.value);

    pieChartInstance.destroy();
    pieChartInstance=null;
    getPieChart(categoryTotals??0);
    

});



function groupExpensesByMonth(year){
    const expensePerYear=expenses.filter(expense =>{
        return expense.date.slice(0,4)===year; 
    });


    const totalExpenses=[];

    for(let i=1;i<=12;i++){
        let total=expensePerYear.reduce((sum,expense)=>{
            return Number(expense.date.slice(5,7)) === i?sum+expense.amount:sum;
        },0);

        totalExpenses.push(Number(total.toFixed(2)));
    }

    return totalExpenses

};

function getLineChart(year){

    const textColor=isDark?"#ffffff":"#000000";
    const gridColor=isDark?"#ffffff34":"#0000003e";

    const MonthlyExpense=groupExpensesByMonth(year);

    if(lineChartInstance){
        lineChartInstance.data.datasets[0].data=MonthlyExpense;
        lineChartInstance.update();
    }else{
        lineChartInstance=new Chart(lineChart,{
            type:"line",
            data:{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets:[{
                    label:'Expenses Per Month',
                    data:MonthlyExpense,


                }]

            },
            options:{
                maintainAspectRatio:false,
                plugins:{
                    legend:{labels: { color: textColor } }
                },
                scales:{
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor },
                        border: { color: gridColor }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor },
                        border: { color: gridColor }
                    }
                }
            }


        });
    }
}

function getYearOptions(){
    yearSelect.innerHTML=""

    let years=[...new Set(expenses.map(expense =>{
        return expense.date.slice(0,4);
    }))];

    years.sort().reverse();

    years.forEach((year,index)=>{
        const option=document.createElement("option");
        option.setAttribute("value",year);
        option.textContent=year;
        if (index === 0) option.selected = true;
        yearSelect.appendChild(option);
    })

        getLineChart(years[0]);

}

yearSelect.addEventListener("change",()=>{
    const year=yearSelect.value;
        getLineChart(year);

});

async function groupExpensesByCategory(){
    try{
        const response=await fetch(`${API_URL}/stats/category`);
        const result=await response.json();
        console.log(result);
        if(!response.ok){
            throw new Error(result.message || "Failed to Fetch category totals");
        }
        const sum = result.reduce((s, r) => s + r.total, 0);
        return CATEGORIES.map(category =>{
            const total=result.find(row =>{ return row.category === category})?.total??0;
            return {
                category,
                total,
                percentage:sum?Number((total/sum*100).toFixed(1)):0
            };
        });

    }catch(error){  
        console.log(error.message);
        return null;
    }
}

function getPieChart(totalExpenses){
    const labels=totalExpenses.map(expense=>expense.category);
    const totals=totalExpenses.map(expense=>expense.total);
    const percentages=totalExpenses.map(expense=>expense.percentage);
    const textColor=isDark?"#ffffff":"#000000";
    if (pieChartInstance) {
        pieChartInstance.data.datasets[0].data = totals;
        pieChartInstance.data.datasets[0].percentages = percentages;
        pieChartInstance.update();
    }else{
            pieChartInstance=new Chart(pieChart,{
            type:'doughnut',
            data:{
                labels:labels,
                datasets:[{
                    labels:'Expenses By Categories',
                    data:totals,
                    percentages,
                    backgroundColor:["#28a745","#007bff","#ffc107","#17a2b8","#6c757d"],
                    borderColor:"#ffffff34",
                    hoverBorderWidth: 3,
                    hoverOffset: 14
                }]
            },
                options:{
                    maintainAspectRatio:false,
                    layout:{
                        padding:10
                    },
                    plugins:{
                        legend:{labels: { color: textColor } },
                        tooltip: {
                        displayColors: false,
                        callbacks:{
                            label(context){
                                return [
                                    `total: ${context.raw}`,
                                    `${context.dataset.percentages[context.dataIndex]}%`
                                ];
                            }
                        }
                    }
                }
                }
            }
        );
    }
}

function exportCSV(){

    if (currentExpenses.length === 0) {
        showAlert("Nothing to export.", "warning");
        return;
    }

    const header = ["Title", "Amount", "Category", "Date"].join(",");


    let rows=currentExpenses.map(expense => 
    [expense.title,expense.amount,expense.category,expense.date].join(",")
    );

    rows= [header, ...rows].join("\r\n");

    const CSVFile = new Blob([rows], { type: "text/csv" });
    let temp_link = document.createElement('a');

    temp_link.download="table.csv";
    let url=window.URL.createObjectURL(CSVFile);
    temp_link.href=url;

    temp_link.style.display="none";
    document.body.appendChild(temp_link);

        temp_link.click();
    document.body.removeChild(temp_link);


}

document.getElementById("export-csv").addEventListener("click", exportCSV);
