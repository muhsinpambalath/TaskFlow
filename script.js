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
let expansion = document.querySelector(".task-options");
let toggleExpansion = document.getElementById("toggle-icon");
let editingTask = null;
let dateBox = document.createElement("input");
let prioritySelector = document.createElement("select");
let categorySelector = document.createElement("select");

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
        if(window.innerWidth <= 700)
        {
            note.classList.add("not-found-txt");
        }
        else{
            note.style.top="480px";
        }
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
        taskName.task.toLowerCase() === newTask.value.trim().toLowerCase() && taskName !== editingTask
    );
    if(newTask.value.trim() != "" && !exist)
    {
        if(editingTask){
            editingTask.task = newTask.value.trim();
            editingTask.isEdited = true;
        }
        else{
            let taskObj = {
                id: Date.now(),
                task: newTask.value.trim(),
                complete: false,
                dueDate : dateBox.value,
                priority: prioritySelector.value,
                category: categorySelector.value,
                updatedAt: null,
                isNew: true,
                isEdited: false
            };
            arr.push(taskObj);
        }
        arr.forEach(()=>{
            console.log(arr);
        })
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

function createDateField(){
    let dueDate = document.createElement("p");
    dueDate.innerHTML="Due Date :";
    dateBox.type="date";
    dateBox.id="duedate";
    expansion.append(dueDate);
    expansion.append(dateBox);
}

function createPriorityField(){
    let priorityHeading = document.createElement("p");
    priorityHeading.innerHTML="Priority :";
    let priorityContainer = document.createElement("div");
    priorityContainer.classList.add("priority-select-container");
    prioritySelector.id="priority";
    priorityContainer.append(prioritySelector);
    let auto = document.createElement("option");
    auto.value = "auto";
    auto.innerHTML="Auto";
    let low = document.createElement("option");
    low.value = "low";
    low.innerHTML="Low";
    let medium = document.createElement("option");
    medium.value = "medium";
    medium.innerHTML="Medium";
    let high = document.createElement("option");
    high.value = "high";
    high.innerHTML="High";
    expansion.append(priorityHeading);
    expansion.append(priorityContainer);
    prioritySelector.append(auto);
    prioritySelector.append(low);
    prioritySelector.append(medium);
    prioritySelector.append(high);
}

function createCategoryField(){
    let categoryHeading = document.createElement("p");
    categoryHeading.innerHTML="Category :";
    let categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-select-container");
    categorySelector.id="category";
    let none = document.createElement("option");
    none.value = "none";
    none.innerHTML="None";
    let personal = document.createElement("option");
    personal.value = "personal";
    personal.innerHTML="Personal";
    let study = document.createElement("option");
    study.value = "study";
    study.innerHTML="Study";
    let work = document.createElement("option");
    work.value = "work";
    work.innerHTML="Work";
    let finance = document.createElement("option");
    finance.value = "finance";
    finance.innerHTML="Finance";
    let health = document.createElement("option");
    health.value = "health";
    health.innerHTML="Health";
    let shopping = document.createElement("option");
    shopping.value = "shopping";
    shopping.innerHTML="Shopping";
    expansion.append(categoryHeading);
    expansion.append(categoryContainer);
    categoryContainer.append(categorySelector);
    categorySelector.append(none);
    categorySelector.append(personal);
    categorySelector.append(study);
    categorySelector.append(work);
    categorySelector.append(finance);
    categorySelector.append(health);
    categorySelector.append(shopping);
}

function extendTaskOption(){
    createDateField();
    createPriorityField();
    createCategoryField();

}

function displayTasks(tasks = arr){
    fullTasks.innerHTML="";
    tasks.forEach(taskObj=>
    {
        let taskField = document.createElement("div");
        taskField.classList.add("task-field");
        fullTasks.append(taskField);
        let edit = document.createElement("i");
        edit.classList.add("fal","fa-pencil","edit-icon");
        taskField.append(edit);
        edit.addEventListener("click",()=>
        {
            editTask(taskObj);
        });
        let taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");
        taskField.append(taskInfo);
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
        taskInfo.append(checkBox);
        taskInfo.append(task);
        taskField.append(deleteButton);
        deleteButton.addEventListener("click",function(){
            let i = arr.indexOf(taskObj);
            taskField.classList.add("removing");
            taskField.addEventListener("animationend",()=>{
                deleteTask(i);
            });
        });
        if(taskObj.isNew){
            taskField.classList.add("adding");
            taskObj.isNew = false;
            taskField.addEventListener("animationend",()=>{
                taskField.classList.remove("adding");
            });
        }
        if(taskObj.isEdited){
            taskField.classList.add("editing");
            taskField.addEventListener("animationend",()=>{
                taskObj.isEdited = false;
                taskField.classList.remove("editing");
            });
        }
        if(taskObj.complete){
            task.classList.add("completed");
        }
    }
    )
}

function editTask(taskObj){
    let heading = document.getElementById("heading");
    heading.innerHTML="Edit Task";
    newTask.value = taskObj.task;
    addButton.innerHTML="Save";
    editingTask = taskObj;
    overlay.style.display= "flex";
    addTaskInterface.style.display="flex";
    newTask.focus();
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
    editingTask = null;
    let heading = document.getElementById("heading");
    heading.innerHTML="Add Task";
    newTask.value = "";
    addButton.innerHTML="Add";
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

toggleExpansion.addEventListener("change",(event)=>{
    if(event.target.checked === true)
    {
        expansion.style.display="flex";
        extendTaskOption();
    }
    else{
        expansion.innerHTML="";
        expansion.style.display="none";
    }
});

cancelButton.addEventListener("click",function(){
    existingTask = null;
    expansion.innerHTML="";
    expansion.style.display="none";
    toggleExpansion.checked=false;
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