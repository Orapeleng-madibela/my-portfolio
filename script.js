// Main JavaScript file for the Portfolio Website

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  initDarkMode()
  initTypingEffect()
  initProjectModal()
  initGitHubIntegration()
  initParticles()
  initScrollAnimations()
  initSkillsAnimation()
  initProjectFilters()
  setCurrentYear()
  initSmoothScrolling()
  initLazyLoading()
  initMobileMenu()
  initContactForm()
})

// Function to initialize dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")
  const body = document.body
  const icon = darkModeToggle.querySelector("i")

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    body.classList.toggle("light-mode")
    const isLightMode = body.classList.contains("light-mode")
    localStorage.setItem("lightMode", isLightMode)

    // Update icon based on mode
    if (isLightMode) {
      icon.className = "fas fa-moon"
    } else {
      icon.className = "fas fa-sun"
    }
  }

  // Add click event listener to dark mode toggle button
  darkModeToggle.addEventListener("click", toggleDarkMode)

  // Check for saved mode preference
  const savedLightMode = localStorage.getItem("lightMode") === "true"
  if (savedLightMode) {
    body.classList.add("light-mode")
    icon.className = "fas fa-moon"
  }

  // Check system preference if no saved preference
  if (localStorage.getItem("lightMode") === null) {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (!prefersDarkMode) {
      body.classList.add("light-mode")
      icon.className = "fas fa-moon"
    }
  }
}

// Function to initialize typing effect
function initTypingEffect() {
  const typingText = document.querySelector(".typing-text")
  const texts = [
    "Web Developer",
    "Data Analyst",
    "Computer Science Student",
    "HTML/CSS/JavaScript Developer",
    "Python Programmer",
    "C++ Programmer",
    "SQL Expert",
    "Power BI Analyst",
    "Data Visualization Specialist",
  ]

  // Using Typed.js for typing animation
  const Typed = window.Typed // Declare Typed variable
  new Typed(typingText, {
    strings: texts,
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  })
}

// Function to initialize project modal
function initProjectModal() {
  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalDescription = document.getElementById("modal-description")
  const modalFiles = document.getElementById("modal-files")
  const modalLink = document.getElementById("modal-link")
  const closeBtn = document.getElementsByClassName("close")[0]

  // Project details
  const projects = {
    "Customer Behavior Analysis": {
      title: "Customer Behavior Analysis",
      description:
        "This data analysis project involved analyzing a large dataset of customer information to identify trends and patterns in purchasing behavior. The project used Python and libraries such as pandas and matplotlib to clean the data, perform statistical analysis, and create visualizations.",
      files: [
        { name: "data_analysis.ipynb", description: "Jupyter Notebook containing the main analysis" },
        { name: "data_cleaning.py", description: "Python script for data cleaning and preprocessing" },
        { name: "visualization.py", description: "Python script for creating visualizations" },
        { name: "report.pdf", description: "Final report summarizing findings and recommendations" },
      ],
    },
    // ... other projects ...
  }

  // Add click event listeners to all "View Details" buttons
  document.querySelectorAll(".view-details").forEach((button) => {
    button.addEventListener("click", () => {
      const projectTitle = button.parentElement.querySelector("h3").textContent
      const project = projects[projectTitle]

      // Populate modal with project details
      modalTitle.textContent = project.title
      modalDescription.textContent = project.description

      // Clear and populate files list
      modalFiles.innerHTML = ""
      if (project.files) {
        const filesList = document.createElement("ul")
        project.files.forEach((file) => {
          const listItem = document.createElement("li")
          listItem.innerHTML = `<strong>${file.name}</strong>: ${file.description}`
          filesList.appendChild(listItem)
        })
        modalFiles.appendChild(filesList)
      }

      // Clear and populate project link
      modalLink.innerHTML = ""
      if (project.link) {
        const link = document.createElement("a")
        link.href = project.link
        link.innerHTML = '<i class="fas fa-external-link-alt"></i> View Live Project'
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        modalLink.appendChild(link)
      }

      // Show modal
      modal.style.display = "block"
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    })
  })

  // Close modal when clicking the close button
  closeBtn.onclick = () => {
    modal.style.display = "none"
    document.body.style.overflow = "" // Re-enable scrolling
  }

  // Close modal when clicking outside the modal content
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none"
      document.body.style.overflow = "" // Re-enable scrolling
    }
  }
}

// Function to initialize GitHub integration
function initGitHubIntegration() {
  const githubUsername = "Orapeleng-madibela"
  const reposSection = document.getElementById("repos")
  const languageStats = document.getElementById("language-stats")
  const languageBar = document.querySelector(".language-bar")
  const languageLabels = document.querySelector(".language-labels")

  // Fetch GitHub repositories
  fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=6`)
    .then((response) => response.json())
    .then((data) => {
      reposSection.innerHTML = "" // Clear loading state

      if (data.length === 0) {
        reposSection.innerHTML = "<p>No repositories found.</p>"
        return
      }

      // Create repository cards
      data.forEach((repo) => {
        const repoElement = document.createElement("div")
        repoElement.classList.add("repo")
        repoElement.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "No description available."}</p>
                    <div class="repo-meta">
                        <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                    </div>
                `
        reposSection.appendChild(repoElement)
      })

      // Fetch language statistics
      return Promise.all(data.map((repo) => fetch(repo.languages_url).then((res) => res.json())))
    })
    .then((languagesData) => {
      if (!languagesData) return

      // Calculate total bytes for each language
      const languageTotals = {}
      languagesData.forEach((repoLanguages) => {
        Object.entries(repoLanguages).forEach(([language, bytes]) => {
          languageTotals[language] = (languageTotals[language] || 0) + bytes
        })
      })

      const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0)

      // Clear previous content
      languageBar.innerHTML = ""
      languageLabels.innerHTML = ""

      // Create language statistics visualization
      Object.entries(languageTotals)
        .sort(([, a], [, b]) => b - a)
        .forEach(([language, bytes]) => {
          const percentage = ((bytes / totalBytes) * 100).toFixed(1)

          // Create language segment in bar
          const segment = document.createElement("div")
          segment.className = "language-segment"
          segment.style.width = `${percentage}%`
          segment.style.backgroundColor = getLanguageColor(language)
          segment.title = `${language}: ${percentage}%`
          languageBar.appendChild(segment)

          // Create language label
          const label = document.createElement("div")
          label.className = "language-label"
          label.innerHTML = `
                        <div class="language-color" style="background-color: ${getLanguageColor(language)}"></div>
                        <span>${language}: ${percentage}%</span>
                    `
          languageLabels.appendChild(label)
        })
    })
    .catch((error) => {
      console.error("Error fetching GitHub data:", error)
      reposSection.innerHTML = "<p>Failed to load GitHub repositories. Please try again later.</p>"
    })
}

// Function to get color for programming language
function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    "C++": "#f34b7d",
    TypeScript: "#2b7489",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#ffac45",
    Go: "#00ADD8",
    Rust: "#dea584",
  }
  return colors[language] || "#808080"
}

// Function to initialize particles background
function initParticles() {
  const particlesJS = window.particlesJS // Declare particlesJS variable
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#4a00e0" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#8e2de2", opacity: 0.4, width: 1 },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    })
  } else {
    console.warn("particles.js not loaded")
  }
}

// Function to initialize scroll animations
function initScrollAnimations() {
  const sections = document.querySelectorAll("section")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    observer.observe(section)
  })
}

// Function to initialize skills animation
function initSkillsAnimation() {
  const progressBars = document.querySelectorAll(".progress-bar")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const percentage = entry.target.getAttribute("data-percentage")
        const progressBarInner = entry.target.querySelector(".progress-bar-inner")

        setTimeout(() => {
          progressBarInner.style.width = `${percentage}%`
        }, 200)

        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  progressBars.forEach((bar) => {
    observer.observe(bar)
  })
}

// Function to initialize project filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projects = document.querySelectorAll(".project")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter projects
      projects.forEach((project) => {
        if (filter === "all" || project.getAttribute("data-category") === filter) {
          project.style.display = "flex"
          setTimeout(() => {
            project.style.opacity = "1"
            project.style.transform = "translateY(0)"
          }, 10)
        } else {
          project.style.opacity = "0"
          project.style.transform = "translateY(20px)"
          setTimeout(() => {
            project.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Function to set the current year in the footer
function setCurrentYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear()
}

// Function to initialize smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      // Close mobile menu if open
      const mobileMenu = document.getElementById("mobile-menu")
      if (mobileMenu.classList.contains("show")) {
        mobileMenu.classList.remove("show")
      }

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Function to initialize lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy-load")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.getAttribute("data-src")
        img.classList.remove("lazy-load")
        observer.unobserve(img)
      }
    })
  }, observerOptions)

  lazyImages.forEach((img) => {
    observer.observe(img)
  })
}

// Function to initialize mobile menu
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const navbar = document.getElementById("navbar")

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active")
    menuToggle.classList.toggle("active")

    if (navbar.classList.contains("active")) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>'
    } else {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
      navbar.classList.remove("active")
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
    }
  })

  // Close menu when clicking on a link
  const navLinks = navbar.querySelectorAll("a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active")
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
    })
  })
}

// Function to initialize contact form
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  const toast = document.getElementById("toast")
  const toastMessage = document.querySelector(".toast-message")
  const successIcon = document.querySelector(".toast-icon.success")
  const errorIcon = document.querySelector(".toast-icon.error")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const formAction = contactForm.getAttribute("action")

    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        // Show success toast
        toastMessage.textContent = "Message sent successfully!"
        successIcon.style.display = "block"
        errorIcon.style.display = "none"
        toast.classList.add("show")

        // Reset form
        contactForm.reset()

        // Hide toast after 5 seconds
        setTimeout(() => {
          toast.classList.remove("show")
        }, 5000)
      } else {
        // Show error toast
        toastMessage.textContent = "Failed to send message. Please try again."
        successIcon.style.display = "none"
        errorIcon.style.display = "block"
        toast.classList.add("show")

        // Hide toast after 5 seconds
        setTimeout(() => {
          toast.classList.remove("show")
        }, 5000)
      }
    } catch (error) {
      console.error("Error sending form:", error)

      // Show error toast
      toastMessage.textContent = "Failed to send message. Please try again."
      successIcon.style.display = "none"
      errorIcon.style.display = "block"
      toast.classList.add("show")

      // Hide toast after 5 seconds
      setTimeout(() => {
        toast.classList.remove("show")
      }, 5000)
    }
  })
}

