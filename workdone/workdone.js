const GOOGLE_CLIENT_ID = '453836583217-1csq1g9rsfopb4fl48hpog58t0qmaje4.apps.googleusercontent.com';

let currentUser = null;
let users = JSON.parse(localStorage.getItem('workdone_users')) || [
    {
        id: 'owner_001',
        name: 'Wahab',
        email: 'aminiwahab01@gmail.com',
        password: 'wahab123456',
        avatar: '👑',
        provider: 'local',
        createdAt: new Date().toISOString()
    }
];
let tasks = [];
let currentFilter = 'all';
let subFilter = 'all';
let selectedDate = null;
let currentMonth = new Date();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('date-select').valueAsDate = new Date();
    checkAuthState();
});

function checkAuthState() {
    const savedUser = localStorage.getItem('workdone_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadUserTasks();
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-container').classList.remove('active');
}

function showApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-container').classList.add('active');
    renderAll();
    updateUserDisplay();
    setTimeout(() => {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `Welcome back, ${currentUser.name}! ${currentUser.avatar} I'm your AI assistant. I can help you manage tasks, track progress, and stay productive. You have ${tasks.filter(t => !t.completed).length} pending tasks. What would you like to do today?`;
        } else {
            addMessage(`Welcome back, ${currentUser.name}! ${currentUser.avatar} I'm your AI assistant. I can help you manage tasks, track progress, and stay productive. You have ${tasks.filter(t => !t.completed).length} pending tasks. What would you like to do today?`, 'ai');
        }
    }, 500);
}

function loadUserTasks() {
    tasks = JSON.parse(localStorage.getItem(`workdone_tasks_${currentUser.id}`)) || [];
}

function saveUserTasks() {
    localStorage.setItem(`workdone_tasks_${currentUser.id}`, JSON.stringify(tasks));
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('account-name').textContent = currentUser.name;
        document.getElementById('account-email').textContent = currentUser.email;
        document.getElementById('account-avatar').textContent = currentUser.avatar;
        document.getElementById('account-tasks').textContent = tasks.filter(t => !t.completed).length;
        document.getElementById('account-progress').textContent = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) + '%' : '0%';
    }
}

function login() {
    console.log('Login function called');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    console.log('Login attempt with email:', email);

    if (!email || !password) {
        alert('Please enter your email and password');
        return;
    }

    console.log('Available users:', users);
    const user = users.find(u => u.email === email && u.password === password);
    console.log('User found:', user);

    if (!user) {
        alert('Invalid credentials. This is a private app for personal use only.');
        return;
    }

    currentUser = user;
    localStorage.setItem('workdone_current_user', JSON.stringify(user));
    loadUserTasks();
    console.log('Calling showApp...');
    showApp();
}

function loginWithGoogle() {
    console.log('🔵 Google login clicked - Function executed!');
    console.log('ℹ️ Using Google client ID:', GOOGLE_CLIENT_ID);
    localStorage.setItem('debug_google_click', 'clicked_' + Date.now());
    alert('✅ Google Sign-In Clicked! Client ID: ' + GOOGLE_CLIENT_ID + '\nCheck console (F12) for details.');

    try {
        // Simulate Google OAuth
        const googleUsers = [
            { name: 'John Doe', email: 'john.doe@gmail.com', avatar: '👨' },
            { name: 'Jane Smith', email: 'jane.smith@gmail.com', avatar: '👩' },
            { name: 'Alex Johnson', email: 'alex.johnson@gmail.com', avatar: '🧑' }
        ];

        // Simulate OAuth popup
        const randomUser = googleUsers[Math.floor(Math.random() * googleUsers.length)];
        console.log('Selected Google user:', randomUser);

        let user = users.find(u => u.email === randomUser.email);

        if (!user) {
            // Create new user if they don't exist
            user = {
                id: 'google_' + Date.now(),
                name: randomUser.name,
                email: randomUser.email,
                avatar: randomUser.avatar,
                provider: 'google',
                createdAt: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem('workdone_users', JSON.stringify(users));
            console.log('New Google user created:', user);
        }

        currentUser = user;
        localStorage.setItem('workdone_current_user', JSON.stringify(user));
        console.log('Google user logged in:', currentUser);

        loadUserTasks();
        console.log('Tasks loaded, showing app...');
        showApp();

        alert('✅ Welcome ' + user.name + '! You are now logged in.');
    } catch (error) {
        console.error('❌ Error in Google login:', error);
        alert('❌ Error: ' + error.message);
    }
}

function register() {
    console.log('🔵 Register function called');
    alert('Creating account...');

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    console.log('Register inputs:', { name, email, password });

    if (!name || !email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters long');
        return;
    }

    if (users.some(u => u.email === email)) {
        alert('❌ An account with this email already exists');
        return;
    }

    const newUser = {
        id: 'local_' + Date.now(),
        name: name,
        email: email,
        password: password,
        avatar: '👤',
        provider: 'local',
        createdAt: new Date().toISOString()
    };

    console.log('Creating new user:', newUser);
    users.push(newUser);
    localStorage.setItem('workdone_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('workdone_current_user', JSON.stringify(newUser));
    console.log('User saved, loading tasks...');
    loadUserTasks();
    console.log('Showing app...');
    showApp();
    alert('✅ Account created! Welcome ' + name + '!');
}

function logout() {
    saveUserTasks();
    currentUser = null;
    tasks = [];
    localStorage.removeItem('workdone_current_user');
    showAuth();
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}


function openSettings() {
    document.getElementById('setting-total').textContent = tasks.length;
    document.getElementById('setting-completed').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        priority: document.getElementById('priority-select').value,
        category: document.getElementById('category-select').value,
        dueDate: document.getElementById('date-select').value,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: currentUser.id
    };

    tasks.unshift(task);
    saveTasks();
    input.value = '';
    renderAll();

    const pending = tasks.filter(t => !t.completed).length;
    if (pending > 3) {
        setTimeout(() => {
            addMessage(`Hey ${currentUser.name}, you now have ${pending} pending tasks. Want me to help prioritize?`, 'ai');
        }, 800);
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderAll();

        if (task.completed) {
            const pending = tasks.filter(t => !t.completed).length;
            const messages = [
                `Great job, ${currentUser.name}! 🎉`,
                `Another one down! Keep it up! 💪`,
                `You're on fire today! 🔥`,
                `Excellent work, Owner! 👑`
            ];
            setTimeout(() => addMessage(messages[Math.floor(Math.random() * messages.length)], 'ai'), 500);

            if (pending === 0) {
                setTimeout(() => addMessage(`🎊 INCREDIBLE! All tasks completed! You're a productivity master, ${currentUser.name}!`, 'ai'), 1000);
            }
        }
    }
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderAll();
    }
}

function saveTasks() {
    saveUserTasks();
}

function renderAll() {
    renderTasks();
    renderCalendar();
    renderUpcoming();
    updateStats();
    updateAccountStats();
}

function renderTasks() {
    const container = document.getElementById('task-list');
    let filtered = tasks;

    if (currentFilter === 'today') {
        const today = formatDate(new Date());
        filtered = tasks.filter(t => t.dueDate === today || (!t.dueDate && isToday(t.createdAt)));
    } else if (currentFilter === 'upcoming') {
        const today = formatDate(new Date());
        filtered = tasks.filter(t => !t.completed && t.dueDate && t.dueDate >= today);
    } else if (currentFilter === 'important') {
        filtered = tasks.filter(t => t.priority === 'high' && !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    } else if (currentFilter === 'date' && selectedDate) {
        filtered = tasks.filter(t => t.dueDate === selectedDate);
    }

    if (subFilter === 'active') filtered = filtered.filter(t => !t.completed);
    if (subFilter === 'completed') filtered = filtered.filter(t => t.completed);
    if (subFilter === 'high') filtered = filtered.filter(t => t.priority === 'high');

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                <div>No tasks found</div>
                <div style="font-size: 14px; margin-top: 8px; opacity: 0.7;">Add a task to get started, ${currentUser.name}</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="tag ${task.priority}">${task.priority}</span>
                    <span class="tag category">${task.category}</span>
                    ${task.dueDate ? `<span class="tag date">${formatDisplayDate(task.dueDate)}</span>` : ''}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
        </div>
    `).join('');
}

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    document.getElementById('calendar-month').textContent = monthNames[month];
    document.getElementById('calendar-year').textContent = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    // Add day headers with better styling
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        grid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    // Add previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        grid.innerHTML += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
    }

    const today = formatDate(new Date());
    const userTasks = tasks.filter(t => !t.completed);

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        const isToday = dateStr === today;
        const isSelected = dateStr === selectedDate;
        const dayTasks = userTasks.filter(t => t.dueDate === dateStr);
        const hasTasks = dayTasks.length > 0;
        const taskCount = dayTasks.length;

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (hasTasks) classes += ' has-tasks';

        // Add task count indicator for days with multiple tasks
        const taskIndicator = taskCount > 1 ? `<span class="task-count">${taskCount}</span>` : '';

        grid.innerHTML += `<div class="${classes}" onclick="selectDate('${dateStr}')" title="${hasTasks ? `${taskCount} task${taskCount > 1 ? 's' : ''} due` : ''}">${day}${taskIndicator}</div>`;
    }

    // Add next month days
    const remaining = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remaining; day++) {
        grid.innerHTML += `<div class="calendar-day other-month">${day}</div>`;
    }

    // Add smooth animation to calendar days
    setTimeout(() => {
        const calendarDays = grid.querySelectorAll('.calendar-day');
        calendarDays.forEach((day, index) => {
            day.style.animationDelay = `${index * 10}ms`;
            day.classList.add('animate-in');
        });
    }, 50);
}

function renderUpcoming() {
    const upcoming = tasks
        .filter(t => !t.completed && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    const container = document.getElementById('upcoming-container');
    if (upcoming.length === 0) {
        container.innerHTML = '<div style="color: var(--text-secondary); font-size: 14px;">No upcoming tasks</div>';
        return;
    }

    container.innerHTML = upcoming.map(task => {
        const date = new Date(task.dueDate);
        const diff = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
        let dateText = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${date.getMonth() + 1}/${date.getDate()}`;

        return `
            <div style="padding: 12px; margin-bottom: 10px; background: var(--bg-tertiary); border-radius: 10px; border-left: 3px solid var(--accent); cursor: pointer;" onclick="selectDate('${task.dueDate}')">
                <div style="font-size: 12px; color: var(--accent); font-weight: 600; margin-bottom: 4px;">${dateText}</div>
                <div style="font-size: 14px;">${escapeHtml(task.text)}</div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('progress-text').textContent = percent + '%';
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('total-count').textContent = total;

    document.getElementById('count-all').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('count-today').textContent = tasks.filter(t => {
        const today = formatDate(new Date());
        return (t.dueDate === today || (!t.dueDate && isToday(t.createdAt))) && !t.completed;
    }).length;
    document.getElementById('count-upcoming').textContent = tasks.filter(t => {
        const today = formatDate(new Date());
        return !t.completed && t.dueDate && t.dueDate > today;
    }).length;
    document.getElementById('count-important').textContent = tasks.filter(t => t.priority === 'high' && !t.completed).length;
}

function updateAccountStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('account-tasks').textContent = total;
    document.getElementById('account-progress').textContent = percent + '%';
}

function sendMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(text);
        addMessage(response, 'ai');
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function showTypingIndicator() {
    const messages = document.getElementById('ai-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

function addMessage(text, sender) {
    const container = document.getElementById('ai-messages');
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(input) {
    const lower = input.toLowerCase();
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed);
    const todayTasks = tasks.filter(t => {
        const today = formatDate(new Date());
        return t.dueDate === today && !t.completed;
    });

    // Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        const timeOfDay = new Date().getHours();
        let greeting = 'Hello';
        if (timeOfDay < 12) greeting = 'Good morning';
        else if (timeOfDay < 17) greeting = 'Good afternoon';
        else greeting = 'Good evening';

        return `${greeting}, ${currentUser.name}! 👋 Ready to tackle your tasks today?`;
    }

    // Account information
    if (lower.includes('my email') || lower.includes('what is my email') || lower.includes('email')) {
        return `Your email is ${currentUser.email} 📧`;
    }

    if (lower.includes('who am i') || lower.includes('my name') || lower.includes('name')) {
        return `You're ${currentUser.name}, the owner of this workspace! 👑`;
    }

    if (lower.includes('my account') || lower.includes('current account') || lower.includes('account')) {
        return `You're signed in as ${currentUser.name} (${currentUser.email}). You have ${pendingTasks.length} pending tasks and ${completedTasks.length} completed tasks. 📊`;
    }

    // Task statistics
    if (lower.includes('how many tasks') || lower.includes('my tasks') || lower.includes('task count')) {
        if (pendingTasks.length === 0) {
            return `You have no pending tasks! 🎉 You're all caught up, ${currentUser.name}!`;
        }
        return `You have ${pendingTasks.length} pending tasks and ${completedTasks.length} completed tasks, ${currentUser.name}. Keep up the great work! 📋`;
    }

    if (lower.includes('progress') || lower.includes('how am i doing')) {
        const total = tasks.length;
        const percent = total === 0 ? 0 : Math.round((completedTasks.length / total) * 100);
        if (percent === 100) {
            return `Amazing! You've completed all ${total} tasks! 🏆 You're a productivity superstar, ${currentUser.name}!`;
        }
        return `You're ${percent}% done with ${completedTasks.length} out of ${total} tasks completed. ${pendingTasks.length} tasks remaining. Keep pushing! 💪`;
    }

    // Priority and planning
    if (lower.includes('prioritize') || lower.includes('what should i do') || lower.includes('priority')) {
        if (highPriorityTasks.length > 0) {
            return `You have ${highPriorityTasks.length} high priority tasks that need attention, ${currentUser.name}. Focus on those first! 🎯`;
        }
        if (todayTasks.length > 0) {
            return `You have ${todayTasks.length} tasks due today. Start with those! 📅`;
        }
        if (pendingTasks.length > 0) {
            return `You have ${pendingTasks.length} pending tasks. Pick one that will make the biggest impact today! 🚀`;
        }
        return `No urgent tasks right now! Take a moment to plan your next goals or enjoy some well-deserved rest. 🎉`;
    }

    // Time-based queries
    if (lower.includes('today') || lower.includes('due today')) {
        if (todayTasks.length === 0) {
            return `No tasks due today! 🎯 You can focus on upcoming tasks or plan for tomorrow.`;
        }
        return `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today. Make sure to tackle ${todayTasks.length > 1 ? 'them' : 'it'}! 📅`;
    }

    if (lower.includes('upcoming') || lower.includes('future') || lower.includes('next')) {
        const upcomingTasks = tasks.filter(t => {
            const today = formatDate(new Date());
            return t.dueDate && t.dueDate > today && !t.completed;
        });
        if (upcomingTasks.length === 0) {
            return `No upcoming tasks scheduled. Great time to plan ahead! 📅`;
        }
        return `You have ${upcomingTasks.length} upcoming task${upcomingTasks.length > 1 ? 's' : ''}. The next one is due ${formatDisplayDate(upcomingTasks[0].dueDate)}. 📋`;
    }

    // Productivity tips
    if (lower.includes('tip') || lower.includes('advice') || lower.includes('help me') || lower.includes('how to')) {
        const tips = [
            `Break large tasks into smaller, manageable steps. You'll feel accomplished with each completion! 🎯`,
            `Use the Pomodoro technique: 25 minutes of focused work, then a 5-minute break. 🍅`,
            `Start your day with your most important task - you'll build momentum! ⚡`,
            `Review your completed tasks at the end of each day to celebrate your progress! 🎉`,
            `Set specific, achievable goals for each day to stay motivated! 📈`,
            `Take regular breaks to maintain focus and avoid burnout. 🌱`,
            `Prioritize tasks by both urgency and importance using the Eisenhower Matrix! 📊`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Motivation
    if (lower.includes('motivate') || lower.includes('encourage') || lower.includes('stuck')) {
        const motivations = [
            `Remember why you started! Every completed task brings you closer to your goals. 💪`,
            `You've got this! Even the smallest step forward is progress. 🚀`,
            `Be proud of how far you've come. You're building something amazing! 🌟`,
            `One task at a time. Focus on the present moment and the rest will follow. 🎯`,
            `Your future self will thank you for the work you're doing today! 🙏`
        ];
        return motivations[Math.floor(Math.random() * motivations.length)];
    }

    // Task management help
    if (lower.includes('add task') || lower.includes('create task') || lower.includes('new task')) {
        return `To add a task, use the input field at the top of the main content area. You can set priority, category, and due date! ➕`;
    }

    if (lower.includes('delete') || lower.includes('remove')) {
        return `To delete a task, hover over it and click the 🗑️ button that appears. Be careful - this action cannot be undone! ⚠️`;
    }

    if (lower.includes('complete') || lower.includes('done') || lower.includes('finish')) {
        return `Click the checkbox next to any task to mark it as completed. Great job staying on top of things! ✅`;
    }

    // Calendar help
    if (lower.includes('calendar') || lower.includes('date') || lower.includes('schedule')) {
        return `Use the calendar in the sidebar to view tasks by date. Click on any date to see tasks due that day! 📅`;
    }

    // Settings
    if (lower.includes('settings') || lower.includes('preferences')) {
        return `Click the ⚙️ Settings button in the header to access your account settings and view task statistics! ⚙️`;
    }

    // Weather queries
    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('outside')) {
        const weatherWidget = document.getElementById('weather-widget');
        if (weatherWidget) {
            const temp = weatherWidget.querySelector('.weather-temp')?.textContent || '--°C';
            const desc = weatherWidget.querySelector('.weather-desc')?.textContent || 'unknown';
            const location = weatherWidget.querySelector('.weather-location')?.textContent || 'your location';

            return `The weather in ${location} is ${desc} with a temperature of ${temp}. Check the weather widget in the sidebar for more details! 🌤️`;
        }
        return `I can see the weather information in your sidebar! It shows current conditions for your location. ☀️`;
    }

    // Default responses
    const defaultResponses = [
        `I'm here to help you stay productive, ${currentUser.name}! Ask me about your tasks, progress, or productivity tips. 🤖`,
        `How can I assist you today? I can help with task management, productivity advice, or answer questions about your account! 💡`,
        `I'm your productivity companion! Try asking about your tasks, progress, or for some motivation. 🚀`,
        `What would you like to know? I can tell you about your tasks, give productivity tips, or help with planning! 📝`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function setFilter(filter) {
    currentFilter = filter;
    selectedDate = null;
    document.querySelectorAll('.sidebar-left .nav-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    renderTasks();
}

function setSubFilter(filter) {
    subFilter = filter;
    document.querySelectorAll('.filters .filter-btn').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    currentFilter = 'date';
    document.querySelectorAll('.sidebar-left .nav-item').forEach(el => el.classList.remove('active'));
    renderCalendar();
    renderTasks();
}

function changeMonth(delta) {
    // Add fade out animation
    const grid = document.getElementById('calendar-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.95)';

    setTimeout(() => {
        currentMonth.setMonth(currentMonth.getMonth() + delta);
        renderCalendar();

        // Add fade in animation
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transform = 'scale(1)';
        }, 50);
    }, 150);
}

function goToToday() {
    const today = new Date();
    const todayStr = formatDate(today);

    // If already on current month, just select today
    if (currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()) {
        selectDate(todayStr);
        // Add a subtle pulse animation to today's date
        setTimeout(() => {
            const todayElement = document.querySelector('.calendar-day.today');
            if (todayElement) {
                todayElement.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    todayElement.style.animation = '';
                }, 600);
            }
        }, 100);
        return;
    }

    // Navigate to current month with animation
    const grid = document.getElementById('calendar-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.95)';

    setTimeout(() => {
        currentMonth = new Date(today.getFullYear(), today.getMonth());
        renderCalendar();
        selectDate(todayStr);

        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transform = 'scale(1)';

            // Pulse today's date
            setTimeout(() => {
                const todayElement = document.querySelector('.calendar-day.today');
                if (todayElement) {
                    todayElement.style.animation = 'pulse 0.6s ease-in-out';
                }
            }, 200);
        }, 50);
    }, 150);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function isToday(dateStr) {
    return new Date(dateStr).toDateString() === new Date().toDateString();
}

function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 86400000));

    if (dateStr === today) return 'Today';
    if (dateStr === tomorrow) return 'Tomorrow';
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Weather functionality
async function fetchWeather() {
    try {
        // Mock weather data with realistic variations
        const weatherConditions = [
            { icon: '☀️', description: 'sunny', temp: 25 },
            { icon: '⛅', description: 'partly cloudy', temp: 22 },
            { icon: '☁️', description: 'cloudy', temp: 18 },
            { icon: '🌧️', description: 'light rain', temp: 16 },
            { icon: '⛈️', description: 'thunderstorm', temp: 14 },
            { icon: '❄️', description: 'snow', temp: 2 },
            { icon: '🌤️', description: 'mostly sunny', temp: 23 }
        ];

        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

        // Add some temperature variation
        const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
        const finalTemp = Math.round(randomCondition.temp + tempVariation);

        updateWeatherWidget({
            location: 'New York, NY', // You can make this configurable
            temp: finalTemp,
            description: randomCondition.description,
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
            icon: randomCondition.icon
        });
    } catch (error) {
        console.error('Weather fetch error:', error);
        updateWeatherWidget(null);
    }
}

function updateWeatherWidget(data) {
    const widget = document.getElementById('weather-widget');
    if (!widget) return;

    if (!data) {
        // Show error state
        widget.innerHTML = `
                <div class="weather-header">
                    <div class="weather-icon">❌</div>
                    <div class="weather-location">Weather unavailable</div>
                </div>
                <div class="weather-info">
                    <div class="weather-desc">Unable to fetch weather data</div>
                </div>
            `;
        return;
    }

    // Update weather data
    widget.querySelector('.weather-icon').textContent = data.icon;
    widget.querySelector('.weather-location').textContent = data.location;
    widget.querySelector('.weather-temp').textContent = `${data.temp}°C`;
    widget.querySelector('.weather-desc').textContent = data.description;

    const detailValues = widget.querySelectorAll('.detail-value');
    detailValues[0].textContent = `${data.humidity}%`;
    detailValues[1].textContent = `${data.windSpeed} km/h`;
}

// Initialize weather on page load
fetchWeather();

document.getElementById('task-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});
document.getElementById('ai-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});
