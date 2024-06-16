document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Save the mode preference to local storage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('mode', 'dark');
        } else {
            localStorage.setItem('mode', 'light');
        }
    });

    // Load the mode preference from local storage
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
