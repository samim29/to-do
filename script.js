let submit_btn = document.querySelector("#input-task");
let list = JSON.parse(localStorage.getItem('list')) || [];

function addToList(task){
    list.push(task);
    // console.log(task);
    localStorage.setItem('list', JSON.stringify(list)); // Save the updated list to localStorage
}
submit_btn.addEventListener("click",() => {
    let inputField = document.getElementById("task");
    
    let toDoTask = inputField.value;

    
    if (toDoTask !==""){
        const taskItem = {
            id: Date.now(), // Unique ID
            taskContent: toDoTask,
            completed: false
        };
        addToList(taskItem);
        document.getElementById("task").value = "";
        loadTask();
    };
    
});

function loadTask(){
    const taskContainer = document.querySelector(".task-list");
    if(!taskContainer) return;
    
    taskContainer.innerHTML = "";

    if (list.length === 0){
        taskContainer.innerHTML = `
        <p>No Task to Do</p>
        `
            
        return;
    };

    list.forEach((element) => {
        const row = document.createElement("div");
        row.classList.add("list-item");
        row.setAttribute("id",element.id);
        
        row.innerHTML = `
            <span>${element.taskContent}</span>
            <button class="done-btn">Mark Done</button>
            <button class="delete-btn">Delete</button>
            <button class = "edit-btn">Edit</button>
        `;
        taskContainer.appendChild(row);
        // console.log(element.completed);//debugging
        if (element.completed) {
            row.querySelector("span").style.textDecoration = "line-through";
            row.querySelector(".done-btn").innerText = "Mark Undone";
            row.querySelector(".done-btn").classList.replace("done-btn", "undone-btn");
        }
        
    });
};


document.addEventListener("click",(event) => {
    if(event.target.classList.contains("done-btn")){
        let taskDiv = event.target.parentElement;
        let taskText = taskDiv.querySelector("span").innerText;
        //Find the task in list and mark it as completed
        list = list.map(task => 
            task.taskContent===taskText?{...task,completed:true}:task
        );

        // Save updated list to localStorage
        localStorage.setItem("list", JSON.stringify(list));
        //update ui
        taskDiv.querySelector("span").style.textDecoration = "line-through";
        event.target.innerHTML="Mark Undone";
        event.target.classList.replace("done-btn", "undone-btn");
        
    }
    else if(event.target.classList.contains("undone-btn")){
        let taskDiv = event.target.parentElement;
        let taskText = taskDiv.querySelector("span").innerText;
        //Find the task in list and mark it as completedss
        let taskID = Number(taskDiv.getAttribute("id"));
        let task = list.find(task => task.id === taskID);
        if (task) task.completed = !task.completed;
        
        
        // Save updated list to localStorage
        localStorage.setItem("list", JSON.stringify(list));
        taskDiv.querySelector("span").style.textDecoration = "none";
        event.target.innerHTML="Mark Done";
        event.target.classList.replace("undone-btn","done-btn");
        
    };
    if (event.target.classList.contains("delete-btn")) {
        let taskDiv = event.target.parentElement;
        let taskID = Number(taskDiv.getAttribute("id")); // Convert to number
        list = list.filter(task => task.id !== taskID);
    
        localStorage.setItem('list', JSON.stringify(list));
    
        taskDiv.remove(); // This removes the task from UI
        if (list.length === 0){
            document.querySelector(".task-list").innerHTML = `
            <p>No Task to Do</p>`    
            return;
        };
    };
    if(event.target.classList.contains("edit-btn")){
        let taskDiv = event.target.parentElement;
        let span = taskDiv.querySelector("span"); // Step 1: Get the existing text element
        let input = document.createElement("input"); // Step 2: Create an input field
        input.setAttribute("class","edit-input");
        input.type = "text";
        input.value = span.innerText; // Pre-fill with the existing task
        span.replaceWith(input); // Step 3: Replace span with input
        
        let save_btn = document.createElement("button");
        save_btn.innerHTML = "Save";
        save_btn.setAttribute("class","save_btn");
        event.target.replaceWith(save_btn);

        taskDiv.querySelectorAll(".done-btn, .undone-btn").forEach(btn => {
            btn.style.display= "none";
        });
    };
        if(event.target.classList.contains("save_btn")){
            let taskDiv = event.target.parentElement;
            let input = taskDiv.querySelector("input"); 
            let span = document.createElement("span"); 
            span.innerText = input.value; 
            input.replaceWith(span); 

            let taskID = Number(taskDiv.getAttribute("id"));
            list = list.map(task => 
                task.id===taskID?{...task,taskContent:input.value}:task
            );
            localStorage.setItem("list", JSON.stringify(list));

            let editButton = document.createElement("button");
            editButton.setAttribute("class","edit-btn");
            editButton.innerHTML = "Edit";
            event.target.replaceWith(editButton);
    
            taskDiv.querySelectorAll(".done-btn, .undone-btn").forEach(btn => {
                btn.style.removeProperty("display");

            });


        };
    


    
});


document.addEventListener("DOMContentLoaded",loadTask);
// document.addEventListener("DOMContentLoaded",updateDoneList);