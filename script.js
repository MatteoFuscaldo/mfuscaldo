(function() {
  'use strict';

  console.log(`
  _____                     _ 
 |  _  |___ ___ ___ ___ ___| |
 |   __| -_|  _|  _| . |   | |
 |__|  |___|_| |_| |___|_|_|_|
  `);

  /**
   * Fetches and applies content from a JSON file.
   * @param {string} url - The URL of the JSON file.
   * @returns {Promise<void>}
   */
  async function loadContent(url) {
    try {
      console.log(`Fetching content from ${url}...`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Content loaded successfully.');

      const elements = {
        name: document.getElementById('name'),
        profession: document.getElementById('profession'),
        about: document.getElementById('about'),
        linkedin: document.getElementById('linkedin'),
        experience: document.getElementById('experience'),
        education: document.getElementById('education')
      };

      Object.entries(elements).forEach(([key, element]) => {
        if (element && data[key]) {
          if (key === 'linkedin') {
            element.textContent = data.contact.linkedin;
            element.href = data.contact.linkedin;
          } else if (key === 'experience' || key === 'education') {
            element.innerHTML = '';
            data[key].forEach(item => {
              const div = document.createElement('div');
              div.className = key === 'experience' ? 'card job' : 'card school';
              div.innerHTML = `
                <h3 class="card__title">${item.jobTitle || item.degree}</h3>
                <p class="card__subtitle">${item.company || item.school}</p>
                <p>${item.duration || item.years}</p>
                <p class="card__content">${item.description}</p>
              `;
              element.appendChild(div);
            });
          } else {
            element.textContent = data[key];
          }
        }
      });

      console.log('Content applied to DOM.');
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
    console.log('DOM fully loaded and parsed.');
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
