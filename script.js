/**
 * Portfolio Website JavaScript
 * Author: Orapeleng Timothy Madibela
 * Description: Interactive functionality for portfolio website
 */

;(() => {
  // ========== CONFIGURATION ==========
  const CONFIG = {
    GITHUB_USERNAME: 'Orapeleng-madibela',
    API_TIMEOUT: 10000,
    TOAST_DURATION: 5000,
    TYPING_TEXTS: [
      'Web Developer',
      'Data Analyst',
      'Computer Science Student',
      'Python Programmer',
      'Problem Solver',
    ],
    TYPING_SPEED: 100,
    TYPING_DELETE_SPEED: 50,
    TYPING_PAUSE: 2000,
  };

  // ========== STATE ==========
  const state = {
    menuOpen: false,
    currentTheme: 'light',
    typingIndex: 0,
    charIndex: 0,
    isDeleting: false,
  };

  // ========== DOM ELEMENTS ==========
  const elements = {};

  // ========== UTILITIES ==========
  const utils = {
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    isInViewport(element, threshold = 0.2) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
    },

    getLanguageColor(language) {
      const colors = {
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Java: '#b07219',
        'C++': '#f34b7d',
        TypeScript: '#2b7489',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
      };
      return colors[language] || '#6e7681';
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },

    animateCounter(element, target, duration = 2000) {
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(update);
    },
  };

  // ========== INITIALIZE ELEMENTS ==========
  function initializeElements() {
    const ids = [
      'header',
      'navbar',
      'menuToggle',
      'mobileOverlay',
      'themeToggle',
      'typingText',
      'contactForm',
      'toast',
      'modal',
      'repos',
      'languageStats',
      'githubError',
      'retryGithub',
      'scrollTop',
      'currentYear',
      'particles',
    ];

    ids.forEach(id => {
      elements[id] = document.getElementById(id);
    });

    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.sections = document.querySelectorAll('.section');
    elements.progressBars = document.querySelectorAll('.progress-bar');
    elements.filterButtons = document.querySelectorAll('.filter-btn');
    elements.projectCards = document.querySelectorAll('.project-card');
    elements.viewProjectButtons = document.querySelectorAll('.view-project');
    elements.statNumbers = document.querySelectorAll('.stat-number');
  }

  // ========== THEME MANAGER ==========
  const themeManager = {
    init() {
      if (!elements.themeToggle) return;

      elements.themeToggle.addEventListener('click', () => this.toggle());
      this.loadTheme();

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    toggle() {
      const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    },

    setTheme(theme) {
      state.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);

      const icon = elements.themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    },

    loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
      }
    },
  };

  // ========== MOBILE MENU ==========
  const mobileMenu = {
    init() {
      if (!elements.menuToggle || !elements.navbar || !elements.mobileOverlay) return;

      elements.menuToggle.addEventListener('click', () => this.toggle());
      elements.mobileOverlay.addEventListener('click', () => this.close());

      elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 769) {
            this.close();
          }
        });
      });

      window.addEventListener('resize', utils.debounce(() => {
        if (window.innerWidth >= 769 && state.menuOpen) {
          this.close();
        }
      }, 250));

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && state.menuOpen) {
          this.close();
        }
      });
    },

    toggle() {
      state.menuOpen ? this.close() : this.open();
    },

    open() {
      state.menuOpen = true;
      elements.menuToggle.classList.add('active');
      elements.menuToggle.setAttribute('aria-expanded', 'true');
      elements.navbar.classList.add('active');
      elements.mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      state.menuOpen = false;
      elements.menuToggle.classList.remove('active');
      elements.menuToggle.setAttribute('aria-expanded', 'false');
      elements.navbar.classList.remove('active');
      elements.mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    },
  };

  // ========== NAVIGATION HIGHLIGHTER ==========
  const navigationHighlighter = {
    init() {
      if (!elements.sections.length || !elements.navLinks.length) return;

      const updateActive = utils.debounce(() => this.update(), 100);
      window.addEventListener('scroll', updateActive);
      this.update();
    },

    update() {
      const scrollPosition = window.scrollY + 100;

      elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    },
  };

  // ========== TYPING EFFECT ==========
  const typingEffect = {
    init() {
      if (!elements.typingText) return;
      this.type();
    },

    type() {
      const currentText = CONFIG.TYPING_TEXTS[state.typingIndex];

      if (state.isDeleting) {
        elements.typingText.textContent = currentText.substring(0, state.charIndex - 1);
        state.charIndex--;
      } else {
        elements.typingText.textContent = currentText.substring(0, state.charIndex + 1);
        state.charIndex++;
      }

      let typeSpeed = state.isDeleting ? CONFIG.TYPING_DELETE_SPEED : CONFIG.TYPING_SPEED;

      if (!state.isDeleting && state.charIndex === currentText.length) {
        typeSpeed = CONFIG.TYPING_PAUSE;
        state.isDeleting = true;
      } else if (state.isDeleting && state.charIndex === 0) {
        state.isDeleting = false;
        state.typingIndex = (state.typingIndex + 1) % CONFIG.TYPING_TEXTS.length;
        typeSpeed = 500;
      }

      setTimeout(() => this.type(), typeSpeed);
    },
  };

  // ========== PARTICLES ==========
  const particlesEffect = {
    init() {
      if (!elements.particles) return;

      const count = window.innerWidth < 768 ? 20 : 40;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = 15 + Math.random() * 10 + 's';
        elements.particles.appendChild(particle);
      }
    },
  };

  // ========== SKILL BARS ==========
  const skillBars = {
    animated: new Set(),

    init() {
      if (!elements.progressBars.length) return;

      const checkBars = utils.debounce(() => this.animate(), 100);
      window.addEventListener('scroll', checkBars);
      this.animate();
    },

    animate() {
      elements.progressBars.forEach(bar => {
        if (utils.isInViewport(bar) && !this.animated.has(bar)) {
          const progress = bar.dataset.progress;
          const fill = bar.querySelector('.progress-fill');

          if (fill && progress) {
            setTimeout(() => {
              fill.style.width = progress + '%';
            }, 200);
            this.animated.add(bar);
          }
        }
      });
    },
  };

  // ========== STAT COUNTERS ==========
  const statCounters = {
    animated: new Set(),

    init() {
      if (!elements.statNumbers.length) return;

      const checkCounters = utils.debounce(() => this.animate(), 100);
      window.addEventListener('scroll', checkCounters);
      this.animate();
    },

    animate() {
      elements.statNumbers.forEach(stat => {
        if (utils.isInViewport(stat) && !this.animated.has(stat)) {
          const target = parseInt(stat.dataset.count, 10);
          utils.animateCounter(stat, target);
          this.animated.add(stat);
        }
      });
    },
  };

  // ========== PROJECT FILTER ==========
  const projectFilter = {
    init() {
      if (!elements.filterButtons.length || !elements.projectCards.length) return;

      elements.filterButtons.forEach(button => {
        button.addEventListener('click', () => this.filter(button));
      });
    },

    filter(activeButton) {
      const filter = activeButton.dataset.filter;

      elements.filterButtons.forEach(btn => btn.classList.remove('active'));
      activeButton.classList.add('active');

      elements.projectCards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    },
  };

  // ========== PROJECT MODAL ==========
  const projectModal = {
    projects: {
      'Customer Behavior Analysis': {
        title: 'Customer Behavior Analysis',
        description: 'This data analysis project involved analyzing a large dataset of customer information to identify trends and patterns in purchasing behavior. The project used Python and libraries such as pandas and matplotlib to clean the data, perform statistical analysis, and create visualizations.',
        tech: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
        files: [
          { name: 'data_analysis.ipynb', desc: 'Main analysis notebook' },
          { name: 'data_cleaning.py', desc: 'Data preprocessing script' },
          { name: 'visualization.py', desc: 'Visualization functions' },
        ],
      },
      'E-commerce Website': {
        title: 'Excellent KB Events and Hire',
        description: 'Developed a responsive e-commerce website for a local business using HTML, CSS, and JavaScript. The website includes services offered by the business for various events including weddings, graduations, funerals, and corporate events.',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        files: [
          { name: 'index.html', desc: 'Main HTML file' },
          { name: 'styles.css', desc: 'Stylesheet' },
          { name: 'script.js', desc: 'JavaScript functionality' },
        ],
        link: 'https://excellent-kb-events.netlify.app/',
      },
      'Sales Dashboard': {
        title: 'Sales Dashboard',
        description: 'Created an interactive sales dashboard using Power BI to visualize sales data and key performance indicators. The dashboard provides insights into sales trends, customer demographics, and product performance.',
        tech: ['Power BI', 'Excel', 'DAX'],
        files: [
          { name: 'sales_dashboard.pbix', desc: 'Power BI dashboard' },
          { name: 'data_model.xlsx', desc: 'Data model' },
        ],
      },
      'My Portfolio': {
        title: 'My Portfolio Website',
        description: 'Developed a personal portfolio website showcasing skills, projects, and GitHub repositories. Features theme switching, animations, and live GitHub data integration.',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        files: [
          { name: 'index.html', desc: 'Main HTML file' },
          { name: 'styles.css', desc: 'Stylesheet' },
          { name: 'script.js', desc: 'JavaScript functionality' },
        ],
        link: 'https://orapeleng-madibela.github.io/my-portfolio/',
      },
      'Orapeleng Creative Webs': {
        title: 'Orapeleng Creative Webs',
        description: 'Designed and developed a creative web design agency website showcasing services, portfolio, and client testimonials. The site features a modern, responsive design with smooth animations.',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        files: [
          { name: 'index.html', desc: 'Main HTML file' },
          { name: 'styles.css', desc: 'Stylesheet' },
          { name: 'script.js', desc: 'JavaScript functionality' },
        ],
        link: 'https://orapelengcreativewebs.netlify.app/',
      },
    },

    init() {
      if (!elements.modal || !elements.viewProjectButtons.length) return;

      elements.viewProjectButtons.forEach(button => {
        button.addEventListener('click', () => this.open(button.dataset.project));
      });

      const closeBtn = elements.modal.querySelector('.modal-close');
      const overlay = elements.modal.querySelector('.modal-overlay');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (overlay) overlay.addEventListener('click', () => this.close());

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
          this.close();
        }
      });
    },

    open(projectName) {
      const project = this.projects[projectName];
      if (!project) return;

      const title = elements.modal.querySelector('#modal-title');
      const description = elements.modal.querySelector('#modal-description');
      const tech = elements.modal.querySelector('#modal-tech');
      const files = elements.modal.querySelector('#modal-files');
      const link = elements.modal.querySelector('#modal-link');

      if (title) title.textContent = project.title;
      if (description) description.textContent = project.description;

      if (tech) {
        tech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');
      }

      if (files && project.files) {
        files.innerHTML = `
          <h4>Project Files</h4>
          <ul>
            ${project.files.map(f => `<li><strong>${f.name}</strong>: ${f.desc}</li>`).join('')}
          </ul>
        `;
      }

      if (link) {
        if (project.link) {
          link.innerHTML = `
            <a href="${project.link}" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt"></i>
              <span>View Live Project</span>
            </a>
          `;
        } else {
          link.innerHTML = '';
        }
      }

      elements.modal.classList.add('active');
      elements.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    close() {
      elements.modal.classList.remove('active');
      elements.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },
  };

  // ========== GITHUB INTEGRATION ==========
  const githubIntegration = {
    fallbackRepos: [
      {
        name: 'my-portfolio',
        description: 'Personal portfolio website showcasing skills and projects',
        html_url: 'https://github.com/Orapeleng-madibela/my-portfolio',
        updated_at: new Date().toISOString(),
      },
      {
        name: 'data-analysis-projects',
        description: 'Collection of data analysis projects using Python',
        html_url: 'https://github.com/Orapeleng-madibela/data-analysis-projects',
        updated_at: new Date().toISOString(),
      },
      {
        name: 'web-development',
        description: 'Web development projects using HTML, CSS, JavaScript',
        html_url: 'https://github.com/Orapeleng-madibela/web-development',
        updated_at: new Date().toISOString(),
      },
    ],

    fallbackLanguages: {
      JavaScript: 40,
      HTML: 30,
      CSS: 20,
      Python: 10,
    },

    init() {
      if (!elements.repos) return;
      this.fetchData();

      if (elements.retryGithub) {
        elements.retryGithub.addEventListener('click', () => this.fetchData());
      }
    },

    showLoading() {
      if (elements.githubError) elements.githubError.style.display = 'none';
      elements.repos.innerHTML = `
        <div class="loading-state">
          <div class="loader"></div>
          <p>Loading repositories...</p>
        </div>
      `;
    },

    showError() {
      if (elements.githubError) elements.githubError.style.display = 'block';
    },

    async fetchData() {
      this.showLoading();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

        const response = await fetch(
          `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=6`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API Error');

        const repos = await response.json();
        this.renderRepos(repos.length ? repos : this.fallbackRepos);

        // Fetch languages
        if (repos[0]?.languages_url) {
          try {
            const langResponse = await fetch(repos[0].languages_url);
            const languages = await langResponse.json();
            this.renderLanguages(Object.keys(languages).length ? languages : this.fallbackLanguages);
          } catch {
            this.renderLanguages(this.fallbackLanguages);
          }
        } else {
          this.renderLanguages(this.fallbackLanguages);
        }
      } catch (error) {
        console.error('GitHub API Error:', error);
        this.renderRepos(this.fallbackRepos);
        this.renderLanguages(this.fallbackLanguages);
        this.showError();
      }
    },

    renderRepos(repos) {
      elements.repos.innerHTML = repos.map(repo => `
        <article class="repo-card">
          <div class="repo-header">
            <div class="repo-icon">
              <i class="fas fa-folder"></i>
            </div>
            <h3 class="repo-name">${repo.name}</h3>
          </div>
          <p class="repo-description">${repo.description || 'No description available.'}</p>
          <div class="repo-footer">
            <span class="repo-date">Updated: ${utils.formatDate(repo.updated_at)}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link">
              View <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `).join('');
    },

    renderLanguages(languages) {
      if (!elements.languageStats) return;

      const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
      const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);

      const bar = elements.languageStats.querySelector('.language-bar');
      const labels = elements.languageStats.querySelector('.language-labels');

      if (bar) {
        bar.innerHTML = sorted.map(([lang, bytes]) => {
          const percentage = ((bytes / total) * 100).toFixed(1);
          return `<div class="language-segment" style="width: ${percentage}%; background-color: ${utils.getLanguageColor(lang)}" title="${lang}: ${percentage}%"></div>`;
        }).join('');
      }

      if (labels) {
        labels.innerHTML = sorted.map(([lang, bytes]) => {
          const percentage = ((bytes / total) * 100).toFixed(1);
          return `
            <div class="language-label">
              <div class="language-color" style="background-color: ${utils.getLanguageColor(lang)}"></div>
              <span>${lang}: ${percentage}%</span>
            </div>
          `;
        }).join('');
      }
    },
  };

  // ========== CONTACT FORM ==========
  const contactForm = {
    init() {
      if (!elements.contactForm) return;

      elements.contactForm.addEventListener('submit', e => this.handleSubmit(e));
    },

    async handleSubmit(e) {
      e.preventDefault();

      const form = elements.contactForm;
      const formData = new FormData(form);
      const action = form.getAttribute('action');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Validate
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--color-error)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        toast.show('Please fill in all required fields.', 'error');
        return;
      }

      // Submit
      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          toast.show('Message sent successfully!', 'success');
          form.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (error) {
        console.error('Form error:', error);
        toast.show('Failed to send message. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    },
  };

  // ========== TOAST ==========
  const toast = {
    show(message, type = 'success') {
      if (!elements.toast) return;

      const toastMessage = elements.toast.querySelector('.toast-message');
      if (toastMessage) toastMessage.textContent = message;

      elements.toast.classList.remove('success', 'error');
      elements.toast.classList.add(type, 'show');

      setTimeout(() => {
        elements.toast.classList.remove('show');
      }, CONFIG.TOAST_DURATION);
    },
  };

  // ========== HEADER SCROLL ==========
  const headerScroll = {
    init() {
      if (!elements.header) return;

      const checkScroll = utils.debounce(() => this.update(), 10);
      window.addEventListener('scroll', checkScroll);
      this.update();
    },

    update() {
      const scrolled = window.scrollY > 50;
      elements.header.classList.toggle('scrolled', scrolled);
    },
  };

  // ========== SCROLL TO TOP ==========
  const scrollToTop = {
    init() {
      if (!elements.scrollTop) return;

      elements.scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      const checkScroll = utils.debounce(() => this.update(), 100);
      window.addEventListener('scroll', checkScroll);
    },

    update() {
      const visible = window.scrollY > 300;
      elements.scrollTop.classList.toggle('visible', visible);
    },
  };

  // ========== SMOOTH SCROLL ==========
  const smoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const target = document.querySelector(targetId);

          if (target) {
            const headerHeight = elements.header?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        });
      });
    },
  };

  // ========== FOOTER YEAR ==========
  function updateFooterYear() {
    if (elements.currentYear) {
      elements.currentYear.textContent = new Date().getFullYear();
    }
  }

  // ========== INITIALIZATION ==========
  function init() {
    initializeElements();

    themeManager.init();
    mobileMenu.init();
    navigationHighlighter.init();
    typingEffect.init();
    particlesEffect.init();
    skillBars.init();
    statCounters.init();
    projectFilter.init();
    projectModal.init();
    githubIntegration.init();
    contactForm.init();
    headerScroll.init();
    scrollToTop.init();
    smoothScroll.init();
    updateFooterYear();
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
