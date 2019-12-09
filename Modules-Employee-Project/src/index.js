import {Request} from "./request";
import {UI} from "./ui";


// Element seçme
const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeesList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");


const request = new Request("http://localhost:3000/employees");
const ui = new UI();

let updateState = null;

eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmployee);
    employeesList.addEventListener("click",UpdateOrDelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}

function getAllEmployees() {

    request.get()
    .then(employees => {
        ui.addAllEmployeeToUI(employees);
    })
    .catch(err => console.log(err));

}

// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err));

// request.post({name:"Çağatay UNCU",department : "Bilişim", salary:4000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.put(1,{name:"yılo zero",department : "Bilişim", salary:3000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.delete(1)
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

function addEmployee (e) {

    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmentInput.value.trim();
    const employeeSalary = salaryInput.value.trim();

    if(employeeName ==="" || employeeDepartment ==="" || employeeSalary==="") {
        alert("Lütfen tüm alanları doldurun.");
    }else {
        request.post({name:employeeName,department:employeeDepartment,salary:employeeSalary})
        .then(employee => {
            ui.addEmployeeToUI(employee);
        })
        .catch(err => console.log(err));
    }


    ui.clearInput();
    e.preventDefault();
}

function UpdateOrDelete (e) {
    if(e.target.id ==="delete-employee") {
        //Silme
        deleteEmployee(e.target);

    }else if (e.target.id==="update-employee") {
        // Güncelleme
        updateEmployeeController(e.target.parentElement.parentElement);
    }
}

function deleteEmployee (targetEmployee) {
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent;
    
    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);
    })
    .catch(err=> console.log(err));
}

function updateEmployeeController(targetEmployee) {
    ui.toggleUpdateButton(targetEmployee);

    if(updateState===null) {
        updateState = {
            updateId : targetEmployee.children[3].textContent,
            updateParent : targetEmployee
        }
    }else {
        updateState = null;
    }
}

function updateEmployee() {
    if(updateState) {
        // Güncelleme işlemi 

        const data = {name:nameInput.value.trim(),department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())};

        request.put(updateState.updateId,data)
        .then(updatedEmployee => {

            ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);
            ui.clearInput();

        })
        .catch(err=> console.log(err));
    }
}