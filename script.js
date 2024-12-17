// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Project modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalFiles = document.getElementById('modal-files');
const modalLink = document.getElementById('modal-link');
const closeBtn = document.getElementsByClassName('close')[0];

const projects = {
    'data-analysis': {
        title: 'Customer Behavior Analysis',
        description: `This data analysis project involved analyzing a large dataset of customer information to identify trends and patterns in purchasing behavior. The project used Python and libraries such as pandas and matplotlib to clean the data, perform statistical analysis, and create visualizations. Key findings included seasonal trends in product categories, correlation between customer age and product preferences, and the impact of marketing campaigns on sales. The results of this analysis were used to inform marketing strategies and product development, leading to a 15% increase in sales over the following quarter.`,
        files: [
            { name: 'data_analysis.ipynb', description: 'Jupyter Notebook containing the main analysis' },
            { name: 'data_cleaning.py', description: 'Python script for data cleaning and preprocessing' },
            { name: 'visualization.py', description: 'Python script for creating visualizations' },
            { name: 'report.pdf', description: 'Final report summarizing findings and recommendations' },
        ],
    },
    'web-dev': {
        title: 'E-commerce Website',
        description: `This web development project involved creating a responsive e-commerce website for a local business. The project used HTML5, CSS3, and JavaScript to build a modern, user-friendly interface. Key features of the website included a responsive design for mobile and desktop devices, a product catalog with search and filter functionality, user account management, a shopping cart system, and integration with a payment gateway. The website also incorporated SEO best practices and performance optimizations to ensure fast loading times and improved search engine rankings.`,
        link: 'https://example-ecommerce-project.com',
    },
};

document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', () => {
        const projectType = button.parentElement.getAttribute('data-project');
        const project = projects[projectType];

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
            link.textContent = 'View Live Website';
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

// GitHub integration
const githubUsername = 'your-github-username';
const reposSection = document.getElementById('repos');

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
    })
    .catch(error => {
        console.error('Error fetching GitHub repositories:', error);
        reposSection.innerHTML = '<p>Failed to load GitHub repositories. Please try again later.</p>';
    });

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursor2 = document.querySelector('.cursor2');

document.addEventListener('mousemove', (e) => {
    cursor.style.cssText = cursor2.style.cssText = `left: ${e.clientX}px; top: ${e.clientY}px;`;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing effect for the main title
const titleElement = document.querySelector('#home h1');
const titleText = titleElement.textContent;
titleElement.textContent = '';

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        titleElement.innerHTML = text.substring(0, i+1) + '<span aria-hidden="true"></span>';
        setTimeout(function() {
            typeWriter(text, i + 1, fnCallback)
        }, 100);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
}

// Start the typing effect
typeWriter(titleText, 0, function() {
    titleElement.classList.add('typing-done');
});

// Intersection Observer for fade-in effect
const faders = document.querySelectorAll('section');
const appearOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

