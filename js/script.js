const input = document.querySelector('#taskInput');
const addBtn = document.querySelector('.addTask');
const taskList = document.querySelector('.task-list ul');

//counter
const totalSpan = document.querySelector('.total');
const completedSpan = document.querySelector('.completed');
const pendingSpan = document.querySelector('.pending');

//filter
const filterSelect = document.querySelector('#statusFilter');

//priority
const prioritySelect = document.querySelector("#prioritySelect");

//search
const searchInput = document.querySelector("#searchInput");

//dark mode
const themeToggle = document.getElementById("themeToggle");

//Local Storage Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// to save tasks
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//clear completed tasks
const clearCompletedBtn = document.querySelector("#clearCompleted");

// to render tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";

        if(task.completed) {
            li.classList.add("completed");
        }

        let priorityClass = "";
        if(task.priority === "High") priorityClass = "priority-high";
        if(task.priority === "Medium") priorityClass = "priority-medium";
        if(task.priority === "Low") priorityClass = "priority-low";

        li.innerHTML = `
        <span class="task-text">${task.text}</span>

        <span class="priority-badge ${priorityClass}"> ${task.priority} </span>

        <div class="task-actions">
            <button class="complete-btn" data-index="${index}">
                <i class="fa-solid fa-check"></i>
            </button>
            
            <button class="edit-btn" data-index="${index}">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="delete-btn" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;

        taskList.appendChild(li);
    });

    updateCount();
    applyFilter();
}

//Enter Key
input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        addBtn.click();
    }
});

//Add task
addBtn.addEventListener('click', () => {
    const taskText = input.value.trim();
    if(taskText === '') 
        return;

    tasks.push({
        text: taskText,
        completed: false,
        priority: prioritySelect.value
    });

    saveToLocalStorage();
    renderTasks();

    input.value = "";
});

//complet, delete and edit
//complete
taskList.addEventListener('click', (e) => {
    if(e.target.closest(".complete-btn")) {
        const index = e.target.closest(".complete-btn").dataset.index;
        tasks[index].completed = !tasks[index].completed;

        saveToLocalStorage();
        renderTasks();
        return;
    }

    //delete
    if(e.target.closest(".delete-btn")) {
        const index = e.target.closest(".delete-btn").dataset.index;
        tasks.splice(index, 1);

        saveToLocalStorage();
        renderTasks();
        return;
    }

    //edit
    if(e.target.closest(".edit-btn")) {
        const index = e.target.closest(".edit-btn").dataset.index;

        const taskItem = e.target.closest(".task-item");
        const taskTextSpan = taskItem.querySelector(".task-text");

        //if already editing, return
        if(taskItem.classList.contains("editing"))
            return;

        taskItem.classList.add("editing");

        //create input box
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.value = tasks[index].text;
        inputBox.className = "edit-input";

        //replace span with input
        taskTextSpan.replaceWith(inputBox);
        inputBox.focus();

        //change edit icon to save icon
        const editBtn = taskItem.querySelector(".edit-btn i");
        editBtn.classList.remove("fa-pen");
        editBtn.classList.add("fa-save");

        //save function
        function saveEdit() {
            const newValue = inputBox.value.trim();

            if (newValue !== "") {
                tasks[index].text = newValue;
            }

            taskItem.classList.remove("editing");
            saveToLocalStorage();
            renderTasks();
        }

        //save on Enter
        inputBox.addEventListener("keydown", (event) => {
            if(event.key === "Enter") {
                saveEdit();
            }
        });

        //save when clicked outside
        inputBox.addEventListener("blur", () => {
            saveEdit();
        });
        return;
    }
});

//update counts
function updateCount() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total-completed;

    totalSpan.textContent = `Total Task: ${total}`;
    completedSpan.textContent = `Completed task: ${completed}`;
    pendingSpan.textContent = `Pending task: ${pending}`;
}

//filter
function applyFilter() {
    const filterValue = filterSelect.value;
    const allTasks = document.querySelectorAll(".task-item");

    allTasks.forEach((taskItem, index) => {
        if(filterValue === 'all') {
            taskItem.style.display = 'flex';
        }
        else if(filterValue === 'completed') {
            taskItem.style.display = tasks[index].completed ? "flex" : "none";
        }
        else if(filterValue === 'pending') {
            taskItem.style.display = tasks[index].completed ? "none" : "flex";
        }
    });
}

//Search tasks
searchInput.addEventListener("keyup", () => {
    const searchText = searchInput.value.toLowerCase();
    const allTasks = document.querySelectorAll(".task-item");

    allTasks.forEach((taskItem, index) => {
        const taskName = tasks[index].text.toLowerCase();

        if(taskName.includes(searchText)) {
            taskItem.style.display = "flex";
        } else {
            taskItem.style.display = "none";
        }
    });
});

//filter change
filterSelect.addEventListener("change", () => {
    applyFilter();
});

//Dark Mode
if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });

//to clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveToLocalStorage();
    renderTasks();
});

//Load task on page load
renderTasks();
