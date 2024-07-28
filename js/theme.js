document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }
});

function setTheme(theme) {
    const body = document.body;
    const toggle = document.querySelector('.toggle-wrapper');

    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        toggle.classList.add('active');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggle.classList.remove('active');
    }

    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(isDarkMode ? 'light' : 'dark');
}
