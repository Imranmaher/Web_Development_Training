
// script.js
let taskCount = 0;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        showNotification('Please enter a task!', 'error');
        return;
    }

    const taskList = document.getElementById('taskList');
    
    // Create task item
    const li = document.createElement('li');
    li.setAttribute('data-id', Date.now());
    
    // Create span for task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;
    
    // Create actions container
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    // Create complete button
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    completeBtn.title = 'Mark as completed';
    completeBtn.onclick = () => {
        li.classList.toggle('completed');
        updateStats();
    };
    
    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    editBtn.title = 'Edit task';
    editBtn.onclick = () => toggleEdit(li, taskSpan);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = () => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        setTimeout(() => {
            li.remove();
            updateStats();
            showNotification('Task deleted', 'success');
        }, 300);
    };
    
    // Append elements
    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(taskSpan);
    li.appendChild(actions);
    taskList.appendChild(li);
    
    taskInput.value = '';
    taskCount++;
    updateStats();
    showNotification('Task added successfully', 'success');
}

function toggleEdit(listItem, taskSpan) {
    const isEditing = listItem.classList.contains('editing');
    
    if (isEditing) {
        // Save changes
        const input = taskSpan.querySelector('input');
        const newText = input.value.trim();
        
        if (newText === '') {
            showNotification('Task cannot be empty!', 'error');
            return;
        }
        
        taskSpan.textContent = newText;
        listItem.classList.remove('editing');
        showNotification('Task updated', 'success');
    } else {
        // Enter edit mode
        const currentText = taskSpan.textContent;
        taskSpan.innerHTML = '';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = currentText;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                toggleEdit(listItem, taskSpan);
            }
        };
        
        taskSpan.appendChild(input);
        listItem.classList.add('editing');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function filterTasks(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        switch(filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}

function updateStats() {
    const totalTasks = document.querySelectorAll('#taskList li').length;
    const completedTasks = document.querySelectorAll('#taskList li.completed').length;
    const remainingTasks = totalTasks - completedTasks;
    
    document.getElementById('taskCount').textContent = remainingTasks;
    
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    
    if (progress === 100) {
        showNotification('Great job! All tasks completed!', 'success');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}