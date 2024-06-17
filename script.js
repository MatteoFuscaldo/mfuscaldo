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

document.addEventListener('DOMContentLoaded', () => {
    // Existing code for dark/light mode...

    // Load and display blog list
    if (document.getElementById('blog-list')) {
        loadBlogList();
    }

    // Load and display a specific blog post if URL hash is set
    if (window.location.hash) {
        const postId = window.location.hash.substring(1);
        loadBlogPost(postId);
    }
});

function loadBlogList() {
    fetch('blog/posts.json')
        .then(response => response.json())
        .then(posts => {
            const blogListContainer = document.getElementById('blog-list');
            blogListContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'blog-summary';
                postElement.innerHTML = `
                    <h3><a href="#${post.id}" onclick="loadBlogPost('${post.id}')">${post.title}</a></h3>
                    <p>${post.date}</p>
                    <p>${post.description}</p>
                `;
                blogListContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error loading blog posts:', error));
}

function loadBlogPost(postId) {
    fetch(`blog/${postId}.md`)
        .then(response => response.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            const html = converter.makeHtml(markdown);

            document.getElementById('post-title').textContent = getPostTitle(markdown);
            document.getElementById('post-date').textContent = getPostDate(markdown);
            document.getElementById('post-content').innerHTML = html;

            document.getElementById('blog-list').style.display = 'none';
            document.getElementById('blog-post').style.display = 'block';

            window.location.hash = postId;
        })
        .catch(error => console.error('Error loading blog post:', error));
}

function getPostTitle(markdown) {
    const titleMatch = markdown.match(/^# (.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled';
}

function getPostDate(markdown) {
    const dateMatch = markdown.match(/^(\d{4}-\d{2}-\d{2})$/m);
    return dateMatch ? dateMatch[1] : 'Unknown date';
}

function showBlogList() {
    document.getElementById('blog-list').style.display = 'block';
    document.getElementById('blog-post').style.display = 'none';
    window.location.hash = '';
}

