/**
 * Portfolio Website JavaScript
 * Author: Orapeleng Timothy Madibela
 * Description: Interactive functionality for portfolio website
 */

;(() => {
  // Configuration object
  const CONFIG = {
    GITHUB_USERNAME: "Orapeleng-madibela",
    API_TIMEOUT: 10000,
    TOAST_DURATION: 5000,
    TYPING_TEXTS: [
      "Web Developer",
      "Data Analyst",
      "Computer Science Student",
      "HTML/CSS/JavaScript",
      "Python Programmer",
      "C++ Programmer",
      "SQL",
      "Power BI",
      "Excel",
      "Data Visualization",
    ],
    PARTICLES_CONFIG: {
      desktop: { count: 80, speed: 6, repulse: 200, push: 4 },
      mobile: { count: 30, speed: 3, repulse: 100, push: 2 },
    },
  }

  // State management
  const state = {
    menuOpen: false,
    skillBarsAnimated: false,
    currentTheme: "dark",
  }

  // DOM elements cache
  const elements = {}

  // Utility functions
  const utils = {
    // Debounce function for performance
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

    // Check if element is in viewport
    isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
    },

    // Get language color for GitHub stats
    getLanguageColor(language) {
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
    },

    // Format date
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  }

  // Initialize DOM elements
  function initializeElements() {
    const elementIds = [
      "menuToggle",
      "closeMenu",
      "navbar",
      "menuOverlay",
      "darkModeToggle",
      "darkModeToggleMobile",
      "contactForm",
      "toast",
      "modal",
      "particles-js",
      "repos",
      "language-stats",
      "github-error",
      "retry-github",
      "currentYear",
    ]

    elementIds.forEach((id) => {
      elements[id] = document.getElementById(id)
    })

    // Cache commonly used element collections
    elements.navItems = document.querySelectorAll(".nav-item")
    elements.navLinks = document.querySelectorAll(".nav-link")
    elements.sections = document.querySelectorAll("section[id]")
    elements.progressBars = document.querySelectorAll(".progress-bar")
    elements.filterButtons = document.querySelectorAll(".filter-btn")
    elements.projects = document.querySelectorAll(".project")
    elements.viewDetailsButtons = document.querySelectorAll(".view-details")
  }

  // Theme management
  const themeManager = {
    init() {
      if (!elements.darkModeToggle || !elements.darkModeToggleMobile) return

      // Set up event listeners
      elements.darkModeToggle.addEventListener("click", this.toggle.bind(this))
      elements.darkModeToggleMobile.addEventListener("click", this.toggle.bind(this))

      // Load saved theme or detect system preference
      this.loadTheme()
    },

    toggle() {
      const body = document.body
      const isLightMode = body.classList.contains("light-mode")

      if (isLightMode) {
        this.setTheme("dark")
      } else {
        this.setTheme("light")
      }
    },

    setTheme(theme) {
      const body = document.body
      const isDark = theme === "dark"

      body.classList.toggle("light-mode", !isDark)
      localStorage.setItem("theme", theme)
      state.currentTheme = theme

      // Update icons
      const iconClass = isDark ? "fas fa-sun" : "fas fa-moon"
      elements.darkModeToggle.querySelector("i").className = iconClass
      elements.darkModeToggleMobile.querySelector("i").className = iconClass
    },

    loadTheme() {
      const savedTheme = localStorage.getItem("theme")

      if (savedTheme) {
        this.setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        this.setTheme(prefersDark ? "dark" : "light")
      }
    },
  }

  // Mobile menu management
  const mobileMenu = {
    init() {
      if (!elements.menuToggle || !elements.navbar || !elements.menuOverlay) return

      // Event listeners
      elements.menuToggle.addEventListener("click", this.open.bind(this))
      elements.menuOverlay.addEventListener("click", this.close.bind(this))

      if (elements.closeMenu) {
        elements.closeMenu.addEventListener("click", this.close.bind(this))
      }

      // Navigation links
      elements.navLinks.forEach((link) => {
        link.addEventListener("click", this.handleNavClick.bind(this))
      })

      // Close menu on window resize
      window.addEventListener(
        "resize",
        utils.debounce(() => {
          if (window.innerWidth >= 768 && state.menuOpen) {
            this.close()
          }
        }, 250),
      )

      // Close menu with Escape key
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.menuOpen) {
          this.close()
        }
      })
    },

    open() {
      if (state.menuOpen) return

      state.menuOpen = true
      elements.menuToggle.classList.add("active")
      elements.menuToggle.setAttribute("aria-expanded", "true")

      // Show overlay and navbar
      elements.menuOverlay.style.display = "block"
      elements.menuOverlay.classList.add("active")
      elements.navbar.classList.add("active")

      // Prevent body scroll
      document.body.style.overflow = "hidden"

      // Animate nav items
      elements.navItems.forEach((item, index) => {
        setTimeout(
          () => {
            item.style.opacity = "1"
            item.style.transform = "translateX(0)"
          },
          50 * (index + 1),
        )
      })
    },

    close() {
      if (!state.menuOpen) return

      state.menuOpen = false
      elements.menuToggle.classList.remove("active")
      elements.menuToggle.setAttribute("aria-expanded", "false")

      // Animate out
      elements.navItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "0"
          item.style.transform = "translateX(20px)"
        }, 30 * index)
      })

      // Hide elements after animation
      setTimeout(() => {
        elements.navbar.classList.remove("active")
        elements.menuOverlay.classList.remove("active")
        elements.menuOverlay.style.display = "none"
        document.body.style.overflow = ""
      }, 300)
    },

    handleNavClick(event) {
      const link = event.currentTarget
      const targetId = link.getAttribute("href")

      if (targetId && targetId.startsWith("#")) {
        event.preventDefault()

        const targetElement = document.querySelector(targetId)
        if (!targetElement) return

        // Close mobile menu first
        this.close()

        // Navigate after menu closes
        setTimeout(() => {
          this.scrollToSection(targetElement)
          this.updateActiveNavItem(link)
        }, 350)
      }
    },

    scrollToSection(element) {
      const header = document.querySelector("header")
      const headerHeight = header ? header.offsetHeight : 0
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    },

    updateActiveNavItem(activeLink) {
      elements.navItems.forEach((item) => item.classList.remove("active"))
      const parentItem = activeLink.closest(".nav-item")
      if (parentItem) {
        parentItem.classList.add("active")
      }
    },
  }

  // Navigation highlighting
  const navigationHighlighter = {
    init() {
      if (!elements.sections.length || !elements.navItems.length) return

      const debouncedUpdate = utils.debounce(this.updateActiveNavItem.bind(this), 100)
      window.addEventListener("scroll", debouncedUpdate)
      window.addEventListener("load", this.updateActiveNavItem.bind(this))
    },

    updateActiveNavItem() {
      const scrollPosition = window.scrollY + 100

      elements.sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          elements.navItems.forEach((item) => item.classList.remove("active"))

          const activeNavItem = document.querySelector(`.nav-item a[href="#${sectionId}"]`)
          if (activeNavItem) {
            activeNavItem.parentElement.classList.add("active")
          }
        }
      })
    },
  }

  // Typing effect
  const typingEffect = {
    init() {
      const typingElement = document.querySelector(".typing-text")
      if (!typingElement) return

      // Declare Typed variable here
      const Typed = window.Typed

      if (typeof Typed !== "undefined") {
        new Typed(typingElement, {
          strings: CONFIG.TYPING_TEXTS,
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 1500,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
        })
      } else {
        typingElement.textContent = CONFIG.TYPING_TEXTS[0]
      }
    },
  }

  // Particles background
  const particlesBackground = {
    init() {
      // Declare particlesJS variable here
      const particlesJS = window.particlesJS
      const pJSDom = window.pJSDom

      if (typeof particlesJS === "undefined" || !elements["particles-js"]) return

      const isMobile = window.innerWidth < 768
      const config = CONFIG.PARTICLES_CONFIG[isMobile ? "mobile" : "desktop"]

      particlesJS("particles-js", {
        particles: {
          number: { value: config.count, density: { enable: true, value_area: 800 } },
          color: { value: "#4a00e0" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#8e2de2",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: config.speed,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            repulse: { distance: config.repulse, duration: 0.4 },
            push: { particles_nb: config.push },
          },
        },
        retina_detect: true,
      })

      // Update on resize
      window.addEventListener(
        "resize",
        utils.debounce(() => {
          if (typeof pJSDom !== "undefined" && pJSDom.length > 0) {
            const newIsMobile = window.innerWidth < 768
            const newConfig = CONFIG.PARTICLES_CONFIG[newIsMobile ? "mobile" : "desktop"]

            pJSDom[0].pJS.particles.number.value = newConfig.count
            pJSDom[0].pJS.particles.move.speed = newConfig.speed
            pJSDom[0].pJS.fn.particlesRefresh()
          }
        }, 250),
      )
    },
  }

  // Skill bars animation
  const skillBars = {
    init() {
      if (!elements.progressBars.length) return

      const debouncedAnimate = utils.debounce(this.animateVisibleBars.bind(this), 100)
      window.addEventListener("scroll", debouncedAnimate)
      window.addEventListener("load", this.animateVisibleBars.bind(this))
    },

    animateVisibleBars() {
      elements.progressBars.forEach((bar) => {
        if (utils.isInViewport(bar) && !bar.classList.contains("animated")) {
          const percentage = bar.getAttribute("data-percentage")
          const progressBarInner = bar.querySelector(".progress-bar-inner")

          if (progressBarInner && percentage) {
            setTimeout(() => {
              progressBarInner.style.width = `${percentage}%`
            }, 200)

            bar.classList.add("animated")
          }
        }
      })
    },
  }

  // Project filtering
  const projectFilter = {
    init() {
      if (!elements.filterButtons.length || !elements.projects.length) return

      elements.filterButtons.forEach((button) => {
        button.addEventListener("click", this.handleFilterClick.bind(this))
      })
    },

    handleFilterClick(event) {
      const button = event.currentTarget
      const filter = button.getAttribute("data-filter")

      if (!filter) return

      // Update active button
      elements.filterButtons.forEach((btn) => {
        btn.classList.remove("active")
        btn.setAttribute("aria-selected", "false")
      })
      button.classList.add("active")
      button.setAttribute("aria-selected", "true")

      // Filter projects
      elements.projects.forEach((project) => {
        const category = project.getAttribute("data-category")
        const shouldShow = filter === "all" || category === filter

        if (shouldShow) {
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
    },
  }

  // Project details modal
  const projectModal = {
    projects: {
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
      "E-commerce Website": {
        title: "Excellent KB Events and Hire",
        description:
          "Developed a responsive e-commerce website for a local business using HTML, CSS, and JavaScript. The website includes services offered by the business for various events including weddings, graduations, funerals, and corporate events. Clients are able to see the previous work done by the business and they able to book services they want and check the price estimation.",
        files: [
          { name: "index.html", description: "Main HTML file" },
          { name: "styles.css", description: "CSS styles for the website" },
          { name: "script.js", description: "JavaScript functionality" },
        ],
        link: "https://excellent-kb-events.netlify.app/",
      },
      "Sales Dashboard": {
        title: "Sales Dashboard",
        description:
          "Created an interactive sales dashboard using Power BI to visualize sales data and key performance indicators. The dashboard provides insights into sales trends, customer demographics, and product performance.",
        files: [
          { name: "sales_dashboard.pbix", description: "Power BI dashboard file" },
          { name: "data_model.xlsx", description: "Excel data model" },
          { name: "documentation.pdf", description: "Dashboard documentation and user guide" },
        ],
      },
      "My Portfolio": {
        title: "My Portfolio Website",
        description:
          "Developed a website that has my details such as contacts. The website has projects i did, skills that i have and my github repositories. JavaScript is used for theme switching, animation, transitions, data fetching from GitHub repository data, showcasing the user's latest projects and displays language statistics.",
        files: [
          { name: "index.html", description: "Main HTML file" },
          { name: "styles.css", description: "CSS styles for the app" },
          { name: "script.js", description: "JavaScript functionality and API integration" },
        ],
        link: "https://orapeleng-madibela.github.io/my-portfolio/",
      },
      "Orapeleng Creative Webs": {
        title: "Orapeleng Creative Webs",
        description:
          "Designed and developed a creative web design agency website showcasing services, portfolio, and client testimonials. The site features a modern, responsive design with smooth animations and interactive elements.",
        files: [
          { name: "index.html", description: "Main HTML file" },
          { name: "styles.css", description: "CSS styles for the website" },
          { name: "script.js", description: "JavaScript functionality and animations" },
          { name: "portfolio.js", description: "Portfolio showcase functionality" },
        ],
        link: "https://orapelengcreativewebs.netlify.app/",
      },
    },

    init() {
      if (!elements.modal || !elements.viewDetailsButtons.length) return

      elements.viewDetailsButtons.forEach((button) => {
        button.addEventListener("click", this.openModal.bind(this))
      })

      // Close modal events
      const closeBtn = elements.modal.querySelector(".close")
      if (closeBtn) {
        closeBtn.addEventListener("click", this.closeModal.bind(this))
      }

      window.addEventListener("click", (event) => {
        if (event.target === elements.modal) {
          this.closeModal()
        }
      })

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && elements.modal.style.display === "block") {
          this.closeModal()
        }
      })
    },

    openModal(event) {
      const button = event.currentTarget
      const projectTitle = button.parentElement.querySelector("h3").textContent
      const project = this.projects[projectTitle]

      if (!project) return

      // Populate modal content
      const modalTitle = elements.modal.querySelector("#modal-title")
      const modalDescription = elements.modal.querySelector("#modal-description")
      const modalFiles = elements.modal.querySelector("#modal-files")
      const modalLink = elements.modal.querySelector("#modal-link")

      if (modalTitle) modalTitle.textContent = project.title
      if (modalDescription) modalDescription.textContent = project.description

      // Files list
      if (modalFiles) {
        modalFiles.innerHTML = ""
        if (project.files && project.files.length > 0) {
          const filesList = document.createElement("ul")
          project.files.forEach((file) => {
            const listItem = document.createElement("li")
            listItem.innerHTML = `<strong>${file.name}</strong>: ${file.description}`
            filesList.appendChild(listItem)
          })
          modalFiles.appendChild(filesList)
        }
      }

      // Project link
      if (modalLink) {
        modalLink.innerHTML = ""
        if (project.link) {
          const link = document.createElement("a")
          link.href = project.link
          link.innerHTML = '<i class="fas fa-external-link-alt"></i> View Live Project'
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          modalLink.appendChild(link)
        }
      }

      // Show modal
      elements.modal.style.display = "block"
      elements.modal.setAttribute("aria-hidden", "false")
      document.body.style.overflow = "hidden"
    },

    closeModal() {
      elements.modal.style.display = "none"
      elements.modal.setAttribute("aria-hidden", "true")
      document.body.style.overflow = ""
    },
  }

  // GitHub integration
  const githubIntegration = {
    fallbackRepos: [
      {
        name: "my-portfolio",
        description: "My personal portfolio website showcasing my skills and projects using HTML, CSS, and JavaScript",
        html_url: "https://github.com/Orapeleng-madibela/my-portfolio",
        updated_at: new Date().toISOString(),
      },
      {
        name: "data-analysis-projects",
        description: "Collection of data analysis projects using Python, pandas, and matplotlib for data visualization",
        html_url: "https://github.com/Orapeleng-madibela/data-analysis-projects",
        updated_at: new Date().toISOString(),
      },
      {
        name: "web-development",
        description: "Web development projects using HTML, CSS, JavaScript and responsive design techniques",
        html_url: "https://github.com/Orapeleng-madibela/web-development",
        updated_at: new Date().toISOString(),
      },
      {
        name: "creative-webs",
        description: "Creative web design agency website with modern UI/UX and responsive design",
        html_url: "https://github.com/Orapeleng-madibela/creative-webs",
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
      if (!elements.repos) return

      this.showLoading()
      this.fetchGitHubData()

      // Retry button
      if (elements["retry-github"]) {
        elements["retry-github"].addEventListener("click", () => {
          this.showLoading()
          this.fetchGitHubData()
        })
      }
    },

    showLoading() {
      if (elements["github-error"]) {
        elements["github-error"].style.display = "none"
      }

      elements.repos.innerHTML = `
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading repositories...</p>
        </div>
      `

      if (elements["language-stats"]) {
        elements["language-stats"].innerHTML = "<h3>Language Statistics</h3><p>Loading language statistics...</p>"
      }
    },

    showError() {
      if (elements["github-error"]) {
        elements["github-error"].style.display = "block"
      }
    },

    async fetchGitHubData() {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT)

        const response = await fetch(
          `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=6`,
          { signal: controller.signal },
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const repos = await response.json()

        if (!repos || repos.length === 0) {
          throw new Error("No repositories found")
        }

        this.showRepositories(repos)

        // Fetch language data for the first repo
        if (elements["language-stats"] && repos[0] && repos[0].languages_url) {
          try {
            const langResponse = await fetch(repos[0].languages_url)
            if (langResponse.ok) {
              const languages = await langResponse.json()
              this.showLanguageStats(languages)
            } else {
              this.showLanguageStats(this.fallbackLanguages)
            }
          } catch {
            this.showLanguageStats(this.fallbackLanguages)
          }
        }
      } catch (error) {
        console.error("Error loading GitHub data:", error)
        this.showRepositories(this.fallbackRepos)
        this.showLanguageStats(this.fallbackLanguages)
        this.showError()
      }
    },

    showRepositories(repos) {
      if (!elements.repos) return

      elements.repos.innerHTML = ""

      if (repos.length === 0) {
        elements.repos.innerHTML = "<p>No repositories found.</p>"
        return
      }

      repos.forEach((repo) => {
        const repoElement = document.createElement("article")
        repoElement.classList.add("repo")

        const updatedDate = utils.formatDate(repo.updated_at)

        repoElement.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available."}</p>
          <div class="repo-meta">
            <span>Updated: ${updatedDate}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
          </div>
        `

        elements.repos.appendChild(repoElement)
      })
    },

    showLanguageStats(languages) {
      if (!elements["language-stats"]) return

      elements["language-stats"].innerHTML = "<h3>Language Statistics</h3>"

      if (!languages || Object.keys(languages).length === 0) {
        elements["language-stats"].innerHTML += "<p>No language data available.</p>"
        return
      }

      const languageBar = document.createElement("div")
      languageBar.className = "language-bar"

      const languageLabels = document.createElement("div")
      languageLabels.className = "language-labels"

      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
      const sortedLanguages = Object.keys(languages).sort((a, b) => languages[b] - languages[a])

      sortedLanguages.forEach((language) => {
        const bytes = languages[language]
        const percentage = ((bytes / totalBytes) * 100).toFixed(1)

        // Language segment in bar
        const segment = document.createElement("div")
        segment.className = "language-segment"
        segment.style.width = `${percentage}%`
        segment.style.backgroundColor = utils.getLanguageColor(language)
        segment.title = `${language}: ${percentage}%`
        languageBar.appendChild(segment)

        // Language label
        const label = document.createElement("div")
        label.className = "language-label"

        const colorBox = document.createElement("div")
        colorBox.className = "language-color"
        colorBox.style.backgroundColor = utils.getLanguageColor(language)

        const text = document.createElement("span")
        text.textContent = `${language}: ${percentage}%`

        label.appendChild(colorBox)
        label.appendChild(text)
        languageLabels.appendChild(label)
      })

      elements["language-stats"].appendChild(languageBar)
      elements["language-stats"].appendChild(languageLabels)
    },
  }

  // Contact form
  const contactForm = {
    init() {
      if (!elements.contactForm || !elements.toast) return

      elements.contactForm.addEventListener("submit", this.handleSubmit.bind(this))
      this.setupFormInputs()
    },

    setupFormInputs() {
      const inputs = elements.contactForm.querySelectorAll("input, textarea")

      inputs.forEach((input) => {
        // Prevent zoom on iOS
        input.style.fontSize = "16px"

        input.addEventListener("focus", function () {
          this.style.borderColor = "var(--primary-color)"
          this.style.boxShadow = "0 0 0 2px rgba(74, 0, 224, 0.2)"
        })

        input.addEventListener("blur", function () {
          this.style.borderColor = ""
          this.style.boxShadow = ""
        })
      })
    },

    async handleSubmit(event) {
      event.preventDefault()

      const formData = new FormData(elements.contactForm)
      const formAction = elements.contactForm.getAttribute("action")

      if (!formAction) {
        this.showToast("Form configuration error. Please try again later.", false)
        return
      }

      // Validate form
      if (!this.validateForm()) {
        this.showToast("Please fill in all required fields.", false)
        return
      }

      const submitButton = elements.contactForm.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      try {
        // Show loading state
        submitButton.disabled = true
        submitButton.textContent = "Sending..."

        const response = await fetch(formAction, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          this.showToast("Message sent successfully!", true)
          elements.contactForm.reset()
        } else {
          throw new Error("Failed to send message")
        }
      } catch (error) {
        console.error("Error sending form:", error)
        this.showToast("Failed to send message. Please try again.", false)
      } finally {
        // Reset button state
        submitButton.disabled = false
        submitButton.textContent = originalText
      }
    },

    validateForm() {
      const inputs = elements.contactForm.querySelectorAll("input[required], textarea[required]")
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.style.borderColor = "var(--error-color)"

          // Add shake animation
          input.style.animation = "shake 0.5s ease-in-out"
          setTimeout(() => {
            input.style.animation = ""
          }, 500)
        } else {
          input.style.borderColor = ""
        }
      })

      return isValid
    },

    showToast(message, isSuccess) {
      const toastMessage = elements.toast.querySelector(".toast-message")
      const successIcon = elements.toast.querySelector(".toast-icon.success")
      const errorIcon = elements.toast.querySelector(".toast-icon.error")

      if (!toastMessage || !successIcon || !errorIcon) return

      toastMessage.textContent = message
      successIcon.style.display = isSuccess ? "block" : "none"
      errorIcon.style.display = isSuccess ? "none" : "block"

      // Show toast
      elements.toast.classList.add("show")

      // Hide after duration
      setTimeout(() => {
        elements.toast.classList.remove("show")
      }, CONFIG.TOAST_DURATION)

      // Allow manual dismiss
      elements.toast.addEventListener(
        "click",
        () => {
          elements.toast.classList.remove("show")
        },
        { once: true },
      )
    },
  }

  // Header scroll effects
  const headerEffects = {
    init() {
      const header = document.getElementById("main-header")
      if (!header) return

      const debouncedScroll = utils.debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (scrollTop > 10) {
          header.classList.add("scrolled")
        } else {
          header.classList.remove("scrolled")
        }
      }, 10)

      window.addEventListener("scroll", debouncedScroll)
    },
  }

  // Smooth scrolling for anchor links
  const smoothScrolling = {
    init() {
      const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)')

      anchorLinks.forEach((anchor) => {
        anchor.addEventListener("click", this.handleClick.bind(this))
      })
    },

    handleClick(event) {
      event.preventDefault()

      const targetId = event.currentTarget.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const header = document.querySelector("header")
        const headerHeight = header ? header.offsetHeight : 0
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    },
  }

  // Utility functions for mobile optimization
  const mobileOptimization = {
    init() {
      this.ensureViewportMeta()
      this.preventContentOverflow()
      this.optimizeTouch()
    },

    ensureViewportMeta() {
      let viewportMeta = document.querySelector('meta[name="viewport"]')
      if (!viewportMeta) {
        viewportMeta = document.createElement("meta")
        viewportMeta.name = "viewport"
        viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        document.head.appendChild(viewportMeta)
      }
    },

    preventContentOverflow() {
      // Handle images
      const images = document.querySelectorAll("img")
      images.forEach((image) => {
        image.style.maxWidth = "100%"
        image.style.height = "auto"
      })

      // Handle tables
      const tables = document.querySelectorAll("table")
      tables.forEach((table) => {
        const wrapper = document.createElement("div")
        wrapper.style.overflowX = "auto"
        wrapper.style.width = "100%"
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      })
    },

    optimizeTouch() {
      // Add touch-friendly styles to interactive elements
      const interactiveElements = document.querySelectorAll("button, a, input, textarea")

      interactiveElements.forEach((element) => {
        element.style.touchAction = "manipulation"
      })
    },
  }

  // Initialize footer year
  function updateFooterYear() {
    if (elements.currentYear) {
      elements.currentYear.textContent = new Date().getFullYear()
    }
  }

  // Main initialization function
  function init() {
    // Initialize DOM elements first
    initializeElements()

    // Initialize all modules
    mobileOptimization.init()
    themeManager.init()
    mobileMenu.init()
    navigationHighlighter.init()
    typingEffect.init()
    particlesBackground.init()
    skillBars.init()
    projectFilter.init()
    projectModal.init()
    githubIntegration.init()
    contactForm.init()
    headerEffects.init()
    smoothScrolling.init()
    updateFooterYear()
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  // Handle page visibility changes for performance
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Pause animations when page is hidden
      const pJSDom = window.pJSDom
      if (typeof pJSDom !== "undefined" && pJSDom.length > 0) {
        pJSDom[0].pJS.fn.vendors.destroypJS()
      }
    } else {
      // Resume animations when page is visible
      if (elements["particles-js"]) {
        particlesBackground.init()
      }
    }
  })
})()
