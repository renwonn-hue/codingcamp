// js/script.js

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. MODE GELAP / TERANG (TEMA)
       ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    let isDarkMode = localStorage.getItem('dashboard_theme') === 'dark';

    const applyTheme = () => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeBtn.textContent = '☀️ Mode Terang';
        } else {
            document.body.classList.remove('dark-mode');
            themeBtn.textContent = '🌙 Mode Gelap';
        }
    };
    applyTheme();

    themeBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('dashboard_theme', isDarkMode ? 'dark' : 'light');
        applyTheme();
    });

    /* =========================================
       2. WAKTU, TANGGAL & SALAM
       ========================================= */
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const greetingText = document.getElementById('greeting-text');
    const userNameElement = document.getElementById('user-name');

    // Muat nama khusus dari LocalStorage
    const savedName = localStorage.getItem('dashboard_name');
    if (savedName) userNameElement.textContent = savedName;

    // Simpan nama saat diedit
    userNameElement.addEventListener('blur', () => {
        localStorage.setItem('dashboard_name', userNameElement.textContent.trim());
    });
    // Cegah enter untuk line break
    userNameElement.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            userNameElement.blur();
        }
    });

    const updateTime = () => {
        const now = new Date();
        
        // Format Waktu (HH:MM:SS)
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        
        // Format Tanggal (Contoh: Tuesday, January 27, 2026)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);

        // Salam berdasarkan jam
        const hour = now.getHours();
        if (hour < 12) greetingText.textContent = "Good Morning";
        else if (hour < 18) greetingText.textContent = "Good Afternoon";
        else greetingText.textContent = "Good Evening";
    };
    
    setInterval(updateTime, 1000);
    updateTime();

    /* =========================================
       3. PENGATUR WAKTU FOKUS (POMODORO)
       ========================================= */
    const timerDisplay = document.getElementById('timer-display');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnReset = document.getElementById('btn-reset');

    let focusTime = 25 * 60; // 25 Menit dalam detik
    let timerInterval = null;

    const renderTimer = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timerDisplay.textContent = ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')};
    };

    btnStart.addEventListener('click', () => {
        if (timerInterval) return; // Mencegah multiple intervals
        timerInterval = setInterval(() => {
            if (focusTime > 0) {
                focusTime--;
                renderTimer(focusTime);
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Waktu fokus selesai!");
            }
        }, 1000);
    });

    btnStop.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    btnReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        focusTime = 25 * 60;
        renderTimer(focusTime);
    });

    /* =========================================
       4. DAFTAR TUGAS (TODO LIST)
       ========================================= */
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];

    const saveTasks = () => localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task-item ${task.completed ? 'completed' : ''};
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                    <span class="task-text" onclick="editTask(${index})">${task.text}</span>
                </div>
                <button class="btn btn-danger" onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(li);
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        // Mencegah Duplikasi
        const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        if (isDuplicate) {
            alert("Tugas sudah ada dalam daftar!");
            return;
        }

        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    // Fungsi Global untuk tugas agar bisa dipanggil dari inline HTML
    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    window.editTask = (index) => {
        const newText = prompt("Edit Tugas:", tasks[index].text);
        if (newText !== null && newText.trim() !== "") {
            // Cek duplikasi saat edit
            const isDuplicate = tasks.some((t, i) => t.text.toLowerCase() === newText.trim().toLowerCase() && i !== index);
            if(isDuplicate) {
                alert("Tugas dengan nama ini sudah ada!");
            } else {
                tasks[index].text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    };

    renderTasks();

    /* =========================================
       5. TAUTAN CEPAT (QUICK LINKS)
       ========================================= */
    const linkForm = document.getElementById('link-form');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const linksContainer = document.getElementById('links-container');

    let links = JSON.parse(localStorage.getItem('dashboard_links')) || [
        { name: 'Google', url: 'https://google.com' },
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Calendar', url: 'https://calendar.google.com' }
    ];

    const saveLinks = () => localStorage.setItem('dashboard_links', JSON.stringify(links));

    const renderLinks = () => {
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const linkWrapper = document.createElement('div');
            linkWrapper.className = 'link-pill';
            
            const a = document.createElement('a');
            a.href = link.url;
            a.target = "_blank"; // Buka di tab baru
            a.textContent = link.name;
            a.style.color = 'white';
            a.style.textDecoration = 'none';

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-link';
            delBtn.innerHTML = '✕';
            delBtn.onclick = () => deleteLink(index);

            linkWrapper.appendChild(a);
            linkWrapper.appendChild(delBtn);
            linksContainer.appendChild(linkWrapper);
        });
    };

    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let url = linkUrlInput.value.trim();
        const name = linkNameInput.value.trim();

        // Pastikan url valid dengan http/https
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        if (name && url) {
            links.push({ name, url });
            saveLinks();
            renderLinks();
            linkNameInput.value = '';
            linkUrlInput.value = '';
        }
    });

    window.deleteLink = (index) => {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    };

    renderLinks();
});