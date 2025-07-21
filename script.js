// Day Planner JavaScript
class DayPlanner {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('dayPlannerTasks')) || [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.updateProgressCircle();
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    }

    bindEvents() {
        // Task form submission
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Quick actions
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompletedTasks();
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAllTasks();
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('edit-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedTask();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('edit-modal');
            if (e.target === modal) {
                this.closeEditModal();
            }
        });
    }

    addTask() {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const time = document.getElementById('task-time').value;
        const priority = document.getElementById('task-priority').value;

        if (!title || !time) {
            alert('Please fill in the task title and time.');
            return;
        }

        const task = {
            id: Date.now().toString(),
            title,
            description,
            time,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgressCircle();
        this.clearForm();

        // Show success feedback
        this.showNotification('Task added successfully!', 'success');
    }

    clearForm() {
        document.getElementById('task-form').reset();
        document.getElementById('task-priority').value = 'medium';
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Sort tasks by time
        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }
            return a.time.localeCompare(b.time);
        });

        container.innerHTML = filteredTasks.map(task => this.getTaskHTML(task)).join('');

        // Bind task-specific events
        this.bindTaskEvents();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            default:
                return this.tasks;
        }
    }

    getTaskHTML(task) {
        const timeFormatted = this.formatTime(task.time);
        const priorityClass = `priority-${task.priority}`;
        const completedClass = task.completed ? 'completed' : '';

        return `
            <div class="task-item ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="dayPlanner.toggleTask('${task.id}')">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <span><i class="fas fa-clock"></i> ${timeFormatted}</span>
                        <span><i class="fas fa-flag"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="dayPlanner.editTask('${task.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" onclick="dayPlanner.deleteTask('${task.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getEmptyStateHTML() {
        const messages = {
            all: {
                icon: 'fas fa-calendar-plus',
                title: 'No tasks yet',
                message: 'Add your first task to get started!'
            },
            pending: {
                icon: 'fas fa-check-circle',
                title: 'All tasks completed!',
                message: 'Great job! You\'ve finished all your tasks.'
            },
            completed: {
                icon: 'fas fa-tasks',
                title: 'No completed tasks',
                message: 'Complete some tasks to see them here.'
            }
        };

        const state = messages[this.currentFilter];
        return `
            <div class="empty-state">
                <i class="${state.icon}"></i>
                <h3>${state.title}</h3>
                <p>${state.message}</p>
            </div>
        `;
    }

    bindTaskEvents() {
        // Events are bound via onclick attributes in the HTML for simplicity
        // This ensures they work even after re-rendering
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgressCircle();

            const message = task.completed ? 'Task completed!' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            
            // Populate edit form
            document.getElementById('edit-task-title').value = task.title;
            document.getElementById('edit-task-description').value = task.description;
            document.getElementById('edit-task-time').value = task.time;
            document.getElementById('edit-task-priority').value = task.priority;
            
            // Show modal
            document.getElementById('edit-modal').style.display = 'block';
        }
    }

    saveEditedTask() {
        if (!this.editingTaskId) return;

        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            const title = document.getElementById('edit-task-title').value.trim();
            const description = document.getElementById('edit-task-description').value.trim();
            const time = document.getElementById('edit-task-time').value;
            const priority = document.getElementById('edit-task-priority').value;

            if (!title || !time) {
                alert('Please fill in the task title and time.');
                return;
            }

            task.title = title;
            task.description = description;
            task.time = time;
            task.priority = priority;

            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
        this.editingTaskId = null;
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgressCircle();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgressCircle();
            this.showNotification('Completed tasks cleared!', 'success');
        }
    }

    clearAllTasks() {
        if (this.tasks.length === 0) {
            alert('No tasks to clear.');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgressCircle();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;

        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
    }

    updateProgressCircle() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const circle = document.getElementById('progress-circle');
        const circumference = 2 * Math.PI * 52; // radius = 52
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDasharray = strokeDasharray;
        circle.style.strokeDashoffset = strokeDashoffset;

        document.getElementById('progress-percentage').textContent = `${percentage}%`;
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('dayPlannerTasks', JSON.stringify(this.tasks));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#4299e1'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export/Import functionality (bonus feature)
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `day-planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedTasks = JSON.parse(e.target.result);
                    if (Array.isArray(importedTasks)) {
                        this.tasks = importedTasks;
                        this.saveTasks();
                        this.renderTasks();
                        this.updateStats();
                        this.updateProgressCircle();
                        this.showNotification('Tasks imported successfully!', 'success');
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (error) {
                    alert('Error importing tasks. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    }
}

// Initialize the day planner when the page loads
let dayPlanner;
document.addEventListener('DOMContentLoaded', () => {
    dayPlanner = new DayPlanner();
});

// Make functions available globally for onclick handlers
window.dayPlanner = dayPlanner;
