document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.getElementById('menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme switching functionality
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = theme === 'light';
    };

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        setTheme(this.checked ? 'light' : 'dark');
    });

    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Uncheck the menu toggle checkbox to close the menu
            menuToggle.checked = false;
        });
    });

    const tabButtons = document.querySelectorAll('.industry-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.industry-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});