let addTaskButton = document.getElementById("button-add");
let searchButton = document.getElementById("search-button");
let searchBar = document.getElementById("task-search");

let addTaskInterface = document.querySelector(".add-task");
let overlay = document.querySelector(".overlay");
let newTask = document.getElementById("new-task");
let addButton = document.getElementById("add-new-task");
let cancelButton = document.getElementById("cancel-new-task");
let displayTasks = document.querySelector(".display-tasks");

let arr = [];


function addTask(){
    let exist = arr.some(taskName=>
        taskName.task === newTask.value.trim()
    );
    if(newTask.value.trim() != "" && !exist)
    {
        let taskObj = {
            task: newTask.value.trim(),
            complete: false
        };
        arr.push(taskObj);
        displayTask(taskObj);
    }
    else{
        if(newTask.value.trim() == "")
            alert("Enter a valid task");
        if(exist == true)
            alert("Task Exists");
    }
    addTaskInterface.style.display="none";
    overlay.style.display= "none";
    newTask.value="";
}

function displayTask(taskObj){
    let taskField = document.createElement("div");
    taskField.classList.add("task-field")
    displayTasks.append(taskField);
    let checkBox = document.createElement("input");
    checkBox.type="checkbox";
    let task = document.createElement("span");
    task.classList.add("task");
    task.textContent = taskObj.task;
    checkBox.addEventListener("change", (event)=>{
        if(event.target.checked)
        {
            taskObj.complete = true;
            task.style.textDecoration="line-through";
        }
        else
        {
            taskObj.complete = false;
            task.style.textDecoration="none";
        }
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task");
    deleteButton.textContent="Delete";
    taskField.append(checkBox);
    taskField.append(task);
    taskField.append(deleteButton);
    deleteButton.addEventListener("click",function(){
        let i = arr.indexOf(taskObj);
        deleteTask(i);
        taskField.remove();
    });
}

function deleteTask(index){
    arr.splice(index,1);
}

addTaskButton.addEventListener("click",function (){
    overlay.style.display= "flex";
    addTaskInterface.style.display="flex";
    newTask.focus();
});

newTask.addEventListener("keydown",(event)=>{
    if(event.key === "Enter")
    {
        addTask();
    }
});

addButton.addEventListener("click",function(){
    addTask();
});

cancelButton.addEventListener("click",function(){
    addTaskInterface.style.display="none";
    overlay.style.display= "none";
    newTask.value="";
});
