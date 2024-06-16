document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    const modeIndicator = document.getElementById('mode-indicator');
    
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('mode', 'dark');
            modeIndicator.textContent = 'Dark Mode is On';
        } else {
            localStorage.setItem('mode', 'light');
            modeIndicator.textContent = 'Light Mode is On';
        }
    });

    // Load the mode preference from local storage
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        modeIndicator.textContent = 'Dark Mode is On';
    } else {
        modeIndicator.textContent = 'Light Mode is On';
    }
});
