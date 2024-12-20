document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    initDarkMode();
    initTypingEffect();
    initProjectModal();
    initGitHubIntegration();
    initParticles();
    initScrollAnimations();
    initSkillsAnimation();
    initProjectFilters();
    setCurrentYear();
    initSmoothScrolling();
    initLazyLoading();
});

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const toggleDarkMode = () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const texts = [
        "Web Developer",
        "Data Analyst",
        "Computer Science Student",
        "HTML/CSS/JavaScript Developer",
        "Python Programmer",
        "C++ Programmer",
        "SQL Expert",
        "Power BI Analyst",
        "Data Visualization Specialist"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

function initProjectModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalFiles = document.getElementById('modal-files');
    const modalLink = document.getElementById('modal-link');
    const closeBtn = document.getElementsByClassName('close')[0];

    const projects = {
        'Customer Behavior Analysis': {
            title: 'Customer Behavior Analysis',
            description: 'This data analysis project involved analyzing a large dataset of customer information to identify trends and patterns in purchasing behavior. The project used Python and libraries such as pandas and matplotlib to clean the data, perform statistical analysis, and create visualizations.',
            files: [
                { name: 'data_analysis.ipynb', description: 'Jupyter Notebook containing the main analysis' },
                { name: 'data_cleaning.py', description: 'Python script for data cleaning and preprocessing' },
                { name: 'visualization.py', description: 'Python script for creating visualizations' },
                { name: 'report.pdf', description: 'Final report summarizing findings and recommendations' },
            ],
        },
        'E-commerce Website': {
            title: 'E-commerce Website',
            description: 'This web development project involved creating a responsive e-commerce website for a local business. The project used HTML5, CSS3, and JavaScript to build a modern, user-friendly interface.',
            link: 'https://example-ecommerce-project.com',
        },
        'Sales Dashboard': {
            title: 'Sales Dashboard',
            description: 'Developed an interactive sales dashboard using Power BI, showcasing key performance indicators and sales trends for a retail company.',
            link: 'https://example-sales-dashboard.com',
        },
        'Weather App': {
            title: 'Weather App',
            description: 'Built a weather application using JavaScript and the OpenWeatherMap API. The app provides current weather conditions and a 5-day forecast for any city.',
            link: 'https://example-weather-app.com',
        },
    };

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const projectTitle = button.parentElement.querySelector('h3').textContent;
            const project = projects[projectTitle];

            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;

            modalFiles.innerHTML = '';
            if (project.files) {
                const filesList = document.createElement('ul');
                project.files.forEach(file => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${file.name}</strong>: ${file.description}`;
                    filesList.appendChild(listItem);
                });
                modalFiles.appendChild(filesList);
            }

            modalLink.innerHTML = '';
            if (project.link) {
                const link = document.createElement('a');
                link.href = project.link;
                link.textContent = 'View Live Project';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                modalLink.appendChild(link);
            }

            modal.style.display = 'block';
        });
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function initGitHubIntegration() {
    const githubUsername = 'Orapeleng-madibela';
    const reposSection = document.getElementById('repos');
    const languageStats = document.getElementById('language-stats');

    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=6`)
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.classList.add('repo');
                repoElement.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <p>Last updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                `;
                reposSection.appendChild(repoElement);
            });

            // Fetch language statistics
            return Promise.all(data.map(repo => 
                fetch(repo.languages_url).then(res => res.json())
            ));
        })
        .then(languagesData => {
            const languageTotals = {};
            languagesData.forEach(repoLanguages => {
                Object.entries(repoLanguages).forEach(([language, bytes]) => {
                    languageTotals[language] = (languageTotals[language] || 0) + bytes;
                });
            });

            const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);
            const languageBar = document.createElement('div');
            languageBar.className = 'language-bar';

            Object.entries(languageTotals)
                .sort(([, a], [, b]) => b - a)
                .forEach(([language, bytes]) => {
                    const percentage = (bytes / totalBytes * 100).toFixed(1);
                    const segment = document.createElement('div');
                    segment.className = 'language-segment';
                    segment.style.width = `${percentage}%`;
                    segment.style.backgroundColor = getLanguageColor(language);
                    segment.title = `${language}: ${percentage}%`;
                    languageBar.appendChild(segment);
                });

            languageStats.innerHTML = '<h3>Language Statistics</h3>';
            languageStats.appendChild(languageBar);
        })
        .catch(error => {
            console.error('Error fetching GitHub data:', error);
            reposSection.innerHTML = '<p>Failed to load GitHub repositories. Please try again later.</p>';
        });
}

function getLanguageColor(language) {
    const colors = {
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Java: '#b07219',
        'C++': '#f34b7d',
    };
    return colors[language] || '#808080';
}

function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
        },
        retina_detect: true
    });
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.progress-bar');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percentage = entry.target.getAttribute('data-percentage');
                entry.target.style.width = `${percentage}%`;
                observer.unobserve(entry.target);
            }
        });
    }, options);

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

function setCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    }, options);

    lazyImages.forEach(img => {
        observer.observe(img);
    });
}

