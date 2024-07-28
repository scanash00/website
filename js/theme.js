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
            const typedElement = document.getElementById('typed');
            const iconContainer = document.querySelector('.icon-container');

            if (theme === 'dark') {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
                toggle.classList.add('active');
                typedElement.style.color = '#f5f5f5';
                iconContainer.style.backgroundColor = 'transparent';
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                toggle.classList.remove('active');
                body.style.backgroundColor = '#e0e0e0'; 
                typedElement.style.color = '#333333'; 
                iconContainer.style.backgroundColor = 'transparent';
            }
            localStorage.setItem('theme', theme);
        }

        function toggleTheme() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            setTheme(isDarkMode ? 'dark' : 'light');
        }
