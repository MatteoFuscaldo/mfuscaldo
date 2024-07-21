(function() {
  'use strict';

  /**
   * Toggles dark mode and saves the preference to local storage.
   * @param {HTMLElement} body - The document body element.
   * @param {HTMLInputElement} toggleButton - The dark mode toggle button.
   */
  function toggleDarkMode(body, toggleButton) {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      localStorage.removeItem('dark-mode');
    }
  }

  /**
   * Initializes dark mode based on saved preference.
   * @param {HTMLElement} body - The document body element.
   * @param {HTMLInputElement} toggleButton - The dark mode toggle button.
   */
  function initDarkMode(body, toggleButton) {
    if (localStorage.getItem('dark-mode') === 'enabled') {
      body.classList.add('dark-mode');
      toggleButton.checked = true;
    }
    toggleButton.addEventListener('change', () => toggleDarkMode(body, toggleButton));
  }

  /**
   * Fetches and applies content from a JSON file.
   * @param {string} url - The URL of the JSON file.
   * @returns {Promise<void>}
   */
  async function loadContent(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const elements = {
        name: document.getElementById('name'),
        profession: document.getElementById('profession'),
        about: document.getElementById('about'),
        linkedin: document.getElementById('linkedin'),
        experience: document.getElementById('experience'),
        education: document.getElementById('education')
      };

      if (elements.name) elements.name.textContent = data.name;
      if (elements.profession) elements.profession.textContent = data.profession;
      if (elements.about) elements.about.textContent = data.about;
      if (elements.linkedin) {
        elements.linkedin.textContent = data.contact.linkedin;
        elements.linkedin.href = data.contact.linkedin;
      }

      if (elements.experience) {
        data.experience.forEach(job => {
          const jobDiv = document.createElement('div');
          jobDiv.className = 'job';
          jobDiv.innerHTML = `
            <h3>${job.jobTitle}</h3>
            <p>${job.company}</p>
            <p>${job.duration}</p>
            <p>${job.description}</p>
          `;
          elements.experience.appendChild(jobDiv);
        });
      }

      if (elements.education) {
        data.education.forEach(school => {
          const schoolDiv = document.createElement('div');
          schoolDiv.className = 'school';
          schoolDiv.innerHTML = `
            <h3>${school.degree}</h3>
            <p>${school.school}</p>
            <p>${school.years}</p>
            <p>${school.description}</p>
          `;
          elements.education.appendChild(schoolDiv);
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  /**
   * Loads and displays the blog list.
   * @returns {Promise<void>}
   */
  async function loadBlogList() {
    try {
      const response = await fetch('blog/posts.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const posts = await response.json();

      const blogListContainer = document.getElementById('blog-list');
      if (!blogListContainer) return;

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
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  }

  /**
   * Loads and displays a specific blog post.
   * @param {string} postId - The ID of the blog post to load.
   * @returns {Promise<void>}
   */
  async function loadBlogPost(postId) {
    try {
      const response = await fetch(`blog/${postId}.md`);
      if (!response.ok) throw new Error('Network response was not ok');
      const markdown = await response.text();

      const converter = new showdown.Converter({
        ghCompatibleHeaderId: true,
        simpleLineBreaks: true,
        strikethrough: true,
        tables: true
      });
      const html = converter.makeHtml(markdown);

      const elements = {
        title: document.getElementById('post-title'),
        date: document.getElementById('post-date'),
        content: document.getElementById('post-content'),
        list: document.getElementById('blog-list'),
        post: document.getElementById('blog-post')
      };

      if (elements.title) elements.title.textContent = getPostTitle(markdown);
      if (elements.date) elements.date.textContent = getPostDate(markdown);
      if (elements.content) elements.content.innerHTML = html;

      if (elements.list) elements.list.style.display = 'none';
      if (elements.post) elements.post.style.display = 'block';

      window.location.hash = postId;
    } catch (error) {
      console.error('Error loading blog post:', error);
    }
  }

  /**
   * Extracts the title from a markdown string.
   * @param {string} markdown - The markdown content.
   * @returns {string} The extracted title or 'Untitled'.
   */
  function getPostTitle(markdown) {
    const titleMatch = markdown.match(/^# (.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled';
  }

  /**
   * Extracts the date from a markdown string.
   * @param {string} markdown - The markdown content.
   * @returns {string} The extracted date or 'Unknown date'.
   */
  function getPostDate(markdown) {
    const dateMatch = markdown.match(/^(\d{4}-\d{2}-\d{2})$/m);
    return dateMatch ? dateMatch[1] : 'Unknown date';
  }

  /**
   * Shows the blog list and hides the blog post.
   */
  function showBlogList() {
    const blogList = document.getElementById('blog-list');
    const blogPost = document.getElementById('blog-post');
    if (blogList) blogList.style.display = 'block';
    if (blogPost) blogPost.style.display = 'none';
    window.location.hash = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('toggle-button');

    if (body && toggleButton) {
      initDarkMode(body, toggleButton);
    }

    loadContent('content.json');

    if (document.getElementById('blog-list')) {
      loadBlogList();
    }

    if (window.location.hash) {
      const postId = window.location.hash.substring(1);
      loadBlogPost(postId);
    }
  });

  // Expose necessary functions to the global scope
  window.loadBlogPost = loadBlogPost;
  window.showBlogList = showBlogList;
})();
