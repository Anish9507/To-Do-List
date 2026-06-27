
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task ${task.completed ? "completed" : ""}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" class="complete" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </div>

            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add Task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const taskItem = e.target.closest(".task");
    if (!taskItem) return;

    const id = Number(taskItem.dataset.id);
    const task = tasks.find(t => t.id === id);

    // Complete Task
    if (e.target.classList.contains("complete")) {
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
        return;
    }

    // Edit Task
    if (e.target.classList.contains("edit")) {
        const updated = prompt("Edit Task", task.text);

        if (updated !== null && updated.trim() !== "") {
            task.text = updated.trim();
            saveTasks();
            renderTasks();
        }
        return;
    }

    // Delete Task
    if (e.target.classList.contains("delete")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        return;
    }

});

// Filters
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

// Initial Load
renderTasks();

