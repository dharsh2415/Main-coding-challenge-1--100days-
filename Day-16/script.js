document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tasksCount = document.getElementById('tasks-count');
    const clearAllBtn = document.getElementById('clear-all');
    const dateDisplay = document.getElementById('date-display');

    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Initialize
    displayDate();
    renderTodos();

    // Event Listeners
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleTodoClick);
    clearAllBtn.addEventListener('click', clearAllTodos);

    // Functions
    function displayDate() {
        const date = new Date();
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        dateDisplay.textContent = date.toLocaleDateString('en-US', options);
    }

    function addTodo(e) {
        e.preventDefault();

        const text = todoInput.value.trim();

        if (text === '') return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.unshift(todo); // Add to top
        saveTodos();
        renderTodos();

        todoInput.value = '';
    }

    function handleTodoClick(e) {
        const item = e.target;
        const todoElement = item.closest('.todo-item');

        if (!todoElement) return;

        const id = parseInt(todoElement.dataset.id);

        // Delete Button Clicked
        if (item.classList.contains('delete-btn') || item.parentElement.classList.contains('delete-btn')) {
            deleteTodo(id, todoElement);
        }

        // Check Button Clicked
        else if (item.classList.contains('check-btn') || item.parentElement.classList.contains('check-btn')) {
            toggleComplete(id);
        }
    }

    function deleteTodo(id, element) {
        // Add slide-out animation class
        element.style.animation = 'slideOut 0.3s ease forwards';

        element.addEventListener('animationend', () => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        });
    }

    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }

    function clearAllTodos() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateCount();
    }

    function updateCount() {
        const count = todos.length;
        tasksCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    }

    function renderTodos() {
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = `
                <li class="empty-state">
                    <i class="fa-solid fa-clipboard-check"></i>
                    <p>No tasks yet. Add one above!</p>
                </li>
            `;
            updateCount();
            return;
        }

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.dataset.id = todo.id;

            li.innerHTML = `
                <div class="check-btn">
                    <i class="fa-solid fa-check"></i>
                </div>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" aria-label="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            todoList.appendChild(li);
        });

        updateCount();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});