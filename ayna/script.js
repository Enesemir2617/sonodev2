document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const addTaskBtn = document.getElementById('addTask');
    const todoList = document.getElementById('todoList');
    const taskCount = document.getElementById('taskCount');
    const completedCount = document.getElementById('completedCount');
    const overdueCount = document.getElementById('overdueCount');
    const clearAllBtn = document.getElementById('clearAll');
    const filterCategory = document.getElementById('filterCategory');
    const filterPriority = document.getElementById('filterPriority');
    const sortByDateBtn = document.getElementById('sortByDate');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    updateTaskList();
    updateStats();

    // Add new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                id: Date.now(),
                text: taskText,
                category: taskCategory.value,
                priority: taskPriority.value,
                dueDate: taskDueDate.value,
                completed: false,
                createdAt: new Date().toISOString()
            });
            saveTasks();
            updateTaskList();
            updateStats();
            taskInput.value = '';
            taskDueDate.value = '';
        }
    });

    // Add task on Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Clear all tasks
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Tüm görevleri silmek istediğinizden emin misiniz?')) {
            tasks = [];
            saveTasks();
            updateTaskList();
            updateStats();
        }
    });

    // Filter tasks
    filterCategory.addEventListener('change', updateTaskList);
    filterPriority.addEventListener('change', updateTaskList);

    // Sort tasks by date
    sortByDateBtn.addEventListener('click', () => {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        updateTaskList();
    });

    // Update task list in the DOM
    function updateTaskList() {
        todoList.innerHTML = '';
        const categoryFilter = filterCategory.value;
        const priorityFilter = filterPriority.value;

        const filteredTasks = tasks.filter(task => {
            const categoryMatch = categoryFilter === 'tümü' || task.category === categoryFilter;
            const priorityMatch = priorityFilter === 'tümü' || task.priority === priorityFilter;
            return categoryMatch && priorityMatch;
        });

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
            
            taskElement.className = `todo-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${task.priority === 'yüksek' ? 'high-priority' : ''}`;
            
            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : 'Tarih yok';
            const priorityClass = `priority-${task.priority}`;
            
            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-info">
                    <div class="task-text">${task.text}</div>
                    <div class="task-details">
                        <span class="task-category">${task.category}</span>
                        <span class="task-priority ${priorityClass}">${task.priority}</span>
                        <span class="task-date">${dueDate}</span>
                    </div>
                </div>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;

            // Toggle task completion
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                updateTaskList();
                updateStats();
            });

            // Delete task
            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                updateTaskList();
                updateStats();
            });

            todoList.appendChild(taskElement);
        });
    }

    // Update statistics
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const overdueTasks = tasks.filter(task => 
            !task.completed && 
            task.dueDate && 
            new Date(task.dueDate) < new Date()
        ).length;

        taskCount.textContent = `${totalTasks} yapılacak var`;
        completedCount.textContent = `${completedTasks} tamamlandı`;
        overdueCount.textContent = `${overdueTasks} gecikmiş`;
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}); 