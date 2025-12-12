// Display Date
const dateElement = document.querySelector(".date");
dateElement.innerHTML = new Date().toDateString();

// Display Live Time
function updateTime() {
    const timeElement = document.querySelector(".time");
    const now = new Date();
    timeElement.innerHTML = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);

const taskList = document.getElementById("taskList");

// Add new task
function addTask() {
    const taskText = document.getElementById("taskInput").value;
    const taskTime = document.getElementById("taskTime").value;

    if (taskText === "") return alert("Enter a task!");

    const task = document.createElement("div");
    task.className = "task";

    task.innerHTML = `
        <div class="task-left">
            <div class="checkbox" onclick="toggleCheck(this)"></div>
            <p>${taskText}</p>
        </div>
        <span class="time-tag">${taskTime || "--:--"}</span>
    `;

    taskList.appendChild(task);

    document.getElementById("taskInput").value = "";
    document.getElementById("taskTime").value = "";
}

// Toggle task completion
function toggleCheck(box) {
    box.classList.toggle("checked");
    box.parentElement.parentElement.classList.toggle("completed");
}
