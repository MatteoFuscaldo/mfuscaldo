document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    const modeIndicator = document.getElementById('mode-indicator');

    const updateButtonAndIndicator = () => {
        if (document.body.classList.contains('dark-mode')) {
            toggleButton.textContent = 'Switch to Light Mode';
            modeIndicator.textContent = 'Dark Mode is On';
        } else {
            toggleButton.textContent = 'Switch to Dark Mode';
            modeIndicator.textContent = 'Light Mode is On';
        }
    };

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('mode', 'dark');
        } else {
            localStorage.setItem('mode', 'light');
        }

        updateButtonAndIndicator();
    });

    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
    }

    updateButtonAndIndicator();

    // Fetch and apply content from the JSON file
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').textContent = data.name;
            document.getElementById('profession').textContent = data.profession;
            document.getElementById('about').textContent = data.about;
            document.getElementById('email').textContent = data.contact.email;
            document.getElementById('phone').textContent = data.contact.phone;
            document.getElementById('linkedin').textContent = data.contact.linkedin;
            document.getElementById('linkedin').href = data.contact.linkedin;

            const experienceContainer = document.getElementById('experience');
            data.experience.forEach(job => {
                const jobDiv = document.createElement('div');
                jobDiv.className = 'job';
                jobDiv.innerHTML = `
                    <h3>${job.jobTitle}</h3>
                    <p>${job.company}</p>
                    <p>${job.duration}</p>
                    <p>${job.description}</p>
                `;
                experienceContainer.appendChild(jobDiv);
            });

            const educationContainer = document.getElementById('education');
            data.education.forEach(school => {
                const schoolDiv = document.createElement('div');
                schoolDiv.className = 'school';
                schoolDiv.innerHTML = `
                    <h3>${school.degree}</h3>
                    <p>${school.school}</p>
                    <p>${school.years}</p>
                    <p>${school.description}</p>
                `;
                educationContainer.appendChild(schoolDiv);
            });
        })
        .catch(error => console.error('Error loading content:', error));
});
