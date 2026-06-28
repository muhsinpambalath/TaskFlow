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
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

let dateBox = document.createElement("input");
let prioritySelector = document.createElement("select");
let categorySelector = document.createElement("select");
let showDetails = document.querySelector(".show-task-details");
let taskDetails = document.querySelector(".task-in-detail-panel");
let statusDetails = document.querySelector(".status-in-detail-panel");
let dateDetails = document.getElementById("date-in-details");
let priorityDetails = document.getElementById("priority-in-details");
let categoryDetails = document.getElementById("category-in-details");
let createdAtDetails = document.getElementById("createdat-in-details");
let closeDetailsButton = document.getElementById("close-details");
let options = document.getElementById("options");
let placeTop = document.querySelector(".add-task-interface");

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
            editingTask.dueDate = dateBox.value;
            editingTask.priority = prioritySelector.value;
            editingTask.category = categorySelector.value;
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
    closeTaskOption();
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
    expansion.style.display="flex";
    createDateField();
    createPriorityField();
    createCategoryField();
    
}

function closeTaskOption(){
    dateBox.value="";
    categorySelector.innerHTML="";
    prioritySelector.innerHTML="";
    expansion.innerHTML="";
    expansion.style.display="none";
    toggleExpansion.checked=false;
}

function displayTasks(tasks = arr){
    fullTasks.innerHTML=""
    tasks.forEach(taskObj=>
    {
        let taskField = document.createElement("div");
        taskField.classList.add("task-field");
        fullTasks.append(taskField);
        taskField.addEventListener("click",()=>{
            openTaskDetails(taskObj,taskField);
        })
        let taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");
        taskField.append(taskInfo);
        let checkBox = document.createElement("input");
        checkBox.type="checkbox";
        checkBox.checked = taskObj.complete;
        checkBox.addEventListener("change",function(){
            overlay.style.display= "none";
            showDetails.style.display="none";
            completeTask(taskObj);
        });
        let task = document.createElement("span");
        task.classList.add("task");
        task.textContent = taskObj.task;
        taskInfo.append(checkBox);
        taskInfo.append(task);
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

function openTaskDetails(taskObj,taskField){
    overlay.style.display="flex";
    addTaskInterface.style.display="none";
    showDetails.style.display="flex";
    taskDetails.innerHTML=taskObj.task;
    let editNdelete = document.querySelector(".edit-n-delete");
    editNdelete.innerHTML="";
    if(taskObj.complete){
        statusDetails.innerHTML="Completed";
        statusDetails.style.backgroundColor ="rgba(0, 255, 0, 0.3)";
    }
    else{
        statusDetails.innerHTML="Pending";
        statusDetails.style.backgroundColor ="rgba(255, 0, 0, 0.5)";
    }
    if(taskObj.dueDate==="")
        dateDetails.innerHTML="None";
    else{
        const dueDate = new Date(taskObj.dueDate);
        formatDueDate(dueDate);
    }
    
    priorityDetails.innerHTML=taskObj.priority;
    priorityScheduling(taskObj.priority);
    
    const createdAtTime = new Date(taskObj.id);
    formatCreatedAt(createdAtTime);
    
    if(taskObj.category===""){
        categoryDetails.classList.remove("border");
        categoryDetails.style.display="none";
    }else{
        categoryDetails.style.display="flex";
        categoryDetails.classList.add("border")
        categoryDetails.innerHTML=taskObj.category;
    }
    let edit = document.createElement("button");
    edit.classList.add("edit-button");
    edit.textContent="Edit";
    edit.addEventListener("click",()=>
    {
        console.log("editChecked");
        overlay.style.display= "none";
        showDetails.style.display="none";
        editTask(taskObj);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task");
    deleteButton.textContent="Delete";
    deleteButton.addEventListener("click",function(){
        overlay.style.display= "none";
        showDetails.style.display="none";
        let i = arr.indexOf(taskObj);
        taskField.classList.add("removing");
        taskField.addEventListener("animationend",()=>{
            deleteTask(i);
        });
    });
    editNdelete.append(edit);
    editNdelete.append(deleteButton);
}

function priorityScheduling(priority){
    priorityDetails.style.display="flex"
    if(priority==="auto"||priority === ""){
        priorityDetails.style.display="none"
    }
    else if(priority === "high"){
        priorityDetails.classList.add("high");
        priorityDetails.classList.remove("low");
        priorityDetails.classList.remove("meduim");
    }
    else if(priority === "medium"){
        priorityDetails.classList.add("medium");
        priorityDetails.classList.remove("high");
        priorityDetails.classList.remove("low");
    }
    else if(priority === "low"){
        priorityDetails.classList.add("low");
        priorityDetails.classList.remove("medium");
        priorityDetails.classList.remove("high");
    }
}

function editTask(taskObj){
    closeTaskOption();
    let heading = document.getElementById("heading");
    heading.innerHTML="Edit Task";
    toggleExpansion.checked=true;
    options.disabled=true;
    options.style.display="none";
    extendTaskOption();
    newTask.value = taskObj.task;
    dateBox.value = taskObj.dueDate;
    prioritySelector.value = taskObj.priority;
    categorySelector.value = taskObj.category;
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

function formatDueDate(dueDate){
    const today = new Date();
    const dateDiff = today-dueDate;
    const daydiff = dateDiff / MILLISECONDS_IN_A_DAY;
    const day = Math.floor(daydiff);
    if(day < -1)
        {
            dateDetails.innerHTML=dueDate.toLocaleDateString("en-GB",{
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        }
    else if(day > 0){
        dateDetails.innerHTML="Over Due";
    }
    else if(day === -1){
        dateDetails.innerHTML="Tomorrow";
    }
    else{
        dateDetails.innerHTML="Today";
    }
}

function formatCreatedAt(createdAtTime){
    const msPerMin = 1000*60;
    const msPerHour = msPerMin*60;
    const msPerDay = msPerHour*24;
    const currentTime = new Date(Date.now());
    const timeRn = currentTime-createdAtTime;
    const seconds = Math.round(timeRn/1000);
    const minutes = Math.round(timeRn/msPerMin);
    const hours = Math.round(timeRn/msPerHour);
    const days = Math.round(timeRn/msPerDay);

    if(seconds <= 59){
        if(seconds === 1)
            createdAtDetails.textContent=`${seconds} sec ago`;
        else
            createdAtDetails.textContent=`${seconds} secs ago`;
    }
    else if(minutes <= 59){
        if(minutes === 1)
            createdAtDetails.textContent=`${minutes} min ago`;
        else
            createdAtDetails.textContent=`${minutes} mins ago`;
    }
    else if(hours <= 24){
        if(hours === 1)
            createdAtDetails.textContent=`${hours} hour ago`;
        else
            createdAtDetails.textContent=`${hours} hours ago`;
    }
    else if(days <= 30){
        if(days === 1)
            createdAtDetails.textContent=`${days} day ago`;
        else
            createdAtDetails.textContent=`${days} days ago`;
    }
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
    placeTop.style.top="30%";
    editingTask = null;
    showDetails.style.display="none";
    let heading = document.getElementById("heading");
    heading.innerHTML="Add Task";
    newTask.value = "";
    dateBox.value = null;
    prioritySelector.value = "";
    categorySelector.value = "";
    options.disabled=false;
    options.style.display="block";
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
        placeTop.style.top="10%";
        extendTaskOption();
    }
    else{
        placeTop.style.top="30%";
        closeTaskOption();
    }
});

cancelButton.addEventListener("click",function(){
    existingTask = null;
    closeTaskOption();
    addTaskInterface.style.display="none";
    overlay.style.display= "none";
    newTask.value="";
    dateBox.value = null;
    prioritySelector.value = "";
    categorySelector.value = "";
});

searchBar.addEventListener("input",function(){
    updateView();
});

filterTask.addEventListener("change",function(){
    updateView();
});

closeDetailsButton.addEventListener("click",()=>{
    overlay.style.display= "none";
    showDetails.style.display="none";
});