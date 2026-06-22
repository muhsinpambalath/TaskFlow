let addTaskButton = document.getElementById("button-add");
let filterTask = document.getElementById("filter-task");
let searchBar = document.getElementById("task-search");

let addTaskInterface = document.querySelector(".add-task");
let overlay = document.querySelector(".overlay");
let newTask = document.getElementById("new-task");
let addButton = document.getElementById("add-new-task");
let cancelButton = document.getElementById("cancel-new-task");
let fullTasks = document.querySelector(".display-tasks");
let emptyState = document.querySelector(".empty-state");

let arr = [];

function saveTask(){
    localStorage.setItem("tasks",JSON.stringify(arr));
}

function loadTask(){
    let existingTask = JSON.parse(localStorage.getItem("tasks"));
    if( existingTask )
    {
        arr = existingTask;
    }
    updateView();
}

function displayEmptyState(img,txt,desc){
    emptyState.innerHTML="";
    emptyState.style.display="flex";
    let icon =document.createElement("img");
    icon.src=img;
    emptyState.append(icon);
    let note = document.createElement("div");
    note.classList.add("empty-state-text");
    if(img === "assets/not-found.svg")
    {
        note.style.top="480px";
    }
    let text = document.createElement("h2");
    text.textContent=txt;
    let description = document.createElement("p");
    description.textContent=desc;
    emptyState.append(note);
    note.append(text);
    note.append(description);
}

function updateEmptyState(state){
    
    if(state.length !== 0)
    {
        emptyState.innerHTML="";
        emptyState.style.display="none";
    }
    else{
        let img = "assets/clip-board.svg";
        let txt = "No Tasks Yet";
        let desc = "Add your first task to get started.";

        let numCompleted = arr.filter(tasks =>
            tasks.complete).length;
        let numPending = arr.filter(tasks =>
            !tasks.complete).length;

        if(searchBar.value.trim() !== "" && state.length === 0)
        {
            img = "assets/not-found.svg";
            txt = "No Matching Tasks";
            desc = "Try another keyword.";
        }
        else if(numCompleted === 0 && filterTask.value === "completed")
        {
            img = "assets/list-pending.svg";
            txt = "Nothing Completed Yet";
            desc = "Finish some tasks to see them here.";
        }
        else if(numPending === 0 && filterTask.value === "pending")
        {
            img = "assets/list-completed.svg";
            txt = "You're All Caught Up";
            desc = "No pending tasks remaining.";
        }
        emptyState.style.animation="none";
        emptyState.offsetHeight;
        emptyState.style.animation= "fadeIn 0.4s ease";
        displayEmptyState(img,txt,desc);
    }
}

function addTask(){
    let exist = arr.some(taskName=>
        taskName.task.toLowerCase() === newTask.value.trim().toLowerCase()
    );
    if(newTask.value.trim() != "" && !exist)
    {
        let taskObj = {
            task: newTask.value.trim(),
            complete: false
        };
        arr.push(taskObj);
        saveTask();
        updateView();
    }
    else{
        if(newTask.value.trim() == "")
            alert("Enter a valid task");
        if(exist)
            alert("Task Exists");
    }
    addTaskInterface.style.display="none";
    overlay.style.display= "none";
    newTask.value="";
}

function displayTasks(tasks = arr){
    fullTasks.innerHTML="";
    tasks.forEach(taskObj=>
    {
        let taskField = document.createElement("div");
        taskField.classList.add("task-field");
        fullTasks.append(taskField);
        let checkBox = document.createElement("input");
        checkBox.type="checkbox";
        checkBox.checked = taskObj.complete;
        checkBox.addEventListener("change",function(){
            completeTask(taskObj);
        });
        let task = document.createElement("span");
        task.classList.add("task");
        task.textContent = taskObj.task;
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task");
        deleteButton.textContent="Delete";
        taskField.append(checkBox);
        taskField.append(task);
        taskField.append(deleteButton);
        deleteButton.addEventListener("click",function(){
            let i = arr.indexOf(taskObj);
            deleteTask(i);
        });
    }
    )
}

function deleteTask(index){
    arr.splice(index,1);
    saveTask()
    updateView();
}

function completeTask(taskObj){
    taskObj.complete=!taskObj.complete;
    saveTask();
    updateView();
}

function updateView()
{
    let tasks = arr;
    
    tasks = tasks.filter(taskObj=>
        taskObj.task.toLowerCase().includes(searchBar.value.toLowerCase())
    )

    if(filterTask.value === "completed")
    {
        tasks = tasks.filter(taskObj =>
            taskObj.complete
        )
    }
    else if (filterTask.value === "pending")
    {
        tasks = tasks.filter(taskObj =>
            !taskObj.complete
        )
    }
    displayTasks(tasks);
    updateEmptyState(tasks);

}

loadTask();

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

searchBar.addEventListener("input",function(){
    updateView();
});

filterTask.addEventListener("change",function(){
    updateView();
});