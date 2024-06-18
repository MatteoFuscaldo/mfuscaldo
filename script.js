document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-button');
  const body = document.body;

  // Check if dark mode is enabled in local storage
  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleButton.checked = true;
  }

  toggleButton.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      localStorage.removeItem('dark-mode');
    }
  });

  // Fetch content from JSON file and populate the page
  fetch('content.json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('name').textContent = data.name;
      document.getElementById('profession').textContent = data.profession;
      document.getElementById('about').textContent = data.about;

      const experienceContainer = document.getElementById('experience');
      data.experience.forEach(exp => {
        const div = document.createElement('div');
        div.classList.add('job');
        div.innerHTML = `<h3>${exp.jobTitle}</h3><h4>${exp.company}</h4><p>${exp.description}</p>`;
        experienceContainer.appendChild(div);
      });

      const educationContainer = document.getElementById('education');
      data.education.forEach(edu => {
        const div = document.createElement('div');
        div.classList.add('school');
        div.innerHTML = `<h3>${edu.degree}</h3><h4>${edu.school}</h4><p>${edu.description}</p>`;
        educationContainer.appendChild(div);
      });

      document.getElementById('email').textContent = data.contact.email;
      document.getElementById('phone').textContent = data.contact.phone;
      const linkedin = document.getElementById('linkedin');
      linkedin.href = data.contact.linkedin;
      linkedin.textContent = data.contact.linkedin;
    })
    .catch(error => console.error('Error loading content:', error));
});
