// Main JavaScript file for the Portfolio Website

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules with proper error handling
  try {
    initDarkMode()
    initTypingEffect()
    initProjectModal()
    initGitHubIntegration()
    initParticles()
    applyAnimationClasses()
    initScrollAnimations()
    initSkillsAnimation()
    initProjectFilters()
    setCurrentYear()
    initSmoothScrolling()
    initLazyLoading()
    initMobileMenu()
    initContactForm()
    initScrollHeader()
    initNavActiveState()
  } catch (error) {
    console.error("Error initializing modules:", error)
  }
})

// Function to initialize dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")
  const darkModeToggleMobile = document.getElementById("darkModeToggleMobile")
  const body = document.body

  // Check if elements exist
  if (!darkModeToggle || !darkModeToggleMobile) {
    console.warn("Dark mode toggle elements not found")
    return
  }

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    body.classList.toggle("light-mode")
    const isLightMode = body.classList.contains("light-mode")
    localStorage.setItem("lightMode", isLightMode)

    // Update icons based on mode
    updateDarkModeIcons(isLightMode)
  }

  // Function to update dark mode icons
  const updateDarkModeIcons = (isLightMode) => {
    const desktopIcon = darkModeToggle.querySelector("i")
    const mobileIcon = darkModeToggleMobile.querySelector("i")

    if (!desktopIcon || !mobileIcon) {
      console.warn("Dark mode icons not found")
      return
    }

    if (isLightMode) {
      desktopIcon.className = "fas fa-moon"
      mobileIcon.className = "fas fa-moon"
    } else {
      desktopIcon.className = "fas fa-sun"
      mobileIcon.className = "fas fa-sun"
    }
  }

  // Add click event listeners to dark mode toggle buttons
  darkModeToggle.addEventListener("click", toggleDarkMode)
  darkModeToggleMobile.addEventListener("click", toggleDarkMode)

  // Check for saved mode preference
  const savedLightMode = localStorage.getItem("lightMode") === "true"
  if (savedLightMode) {
    body.classList.add("light-mode")
    updateDarkModeIcons(true)
  }

  // Check system preference if no saved preference
  if (localStorage.getItem("lightMode") === null) {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (!prefersDarkMode) {
      body.classList.add("light-mode")
      updateDarkModeIcons(true)
    }
  }
}

// Function to initialize mobile menu with improved animations
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const closeMenu = document.getElementById("closeMenu")
  const navbar = document.getElementById("navbar")
  const menuOverlay = document.getElementById("menuOverlay")
  const navItems = document.querySelectorAll(".nav-item")
  const mobileMenuYear = document.getElementById("mobileMenuYear")
  const body = document.body
  let isMenuOpen = false
  const lastScrollTop = 0

  // Check if required elements exist
  if (!menuToggle || !closeMenu || !navbar || !menuOverlay) {
    console.warn("Mobile menu elements not found")
    return
  }

  // Set current year in mobile menu footer if element exists
  if (mobileMenuYear) {
    mobileMenuYear.textContent = new Date().getFullYear()
  }

  // Function to toggle menu button appearance
  const toggleMenuButton = (isActive) => {
    if (isActive) {
      menuToggle.classList.add("active")
      menuToggle.setAttribute("aria-expanded", "true")
    } else {
      menuToggle.classList.remove("active")
      menuToggle.setAttribute("aria-expanded", "false")
    }
  }

  // Function to animate nav items
  const animateNavItems = (shouldShow) => {
    navItems.forEach((item, index) => {
      setTimeout(() => {
        if (shouldShow) {
          item.classList.add("show-item")
        } else {
          item.classList.remove("show-item")
        }
      }, index * 50) // Staggered animation
    })
  }

  // Function to open mobile menu with animation
  const openMenu = () => {
    if (isMenuOpen) return

    isMenuOpen = true
    toggleMenuButton(true)

    // Show overlay first for smooth transition
    menuOverlay.classList.add("active")

    // Then open the menu
    navbar.classList.add("active")

    // Animate nav items after menu is visible
    setTimeout(() => animateNavItems(true), 100)

    // Prevent scrolling when menu is open
    body.style.overflow = "hidden"

    // Add event listeners for keyboard navigation
    document.addEventListener("keydown", handleEscapeKey)
  }

  // Function to close mobile menu with animation
  const closeMenuFunc = () => {
    if (!isMenuOpen) return

    isMenuOpen = false
    toggleMenuButton(false)

    // First hide the nav items
    animateNavItems(false)

    // Then after a short delay, close the menu
    setTimeout(() => {
      navbar.classList.remove("active")
      menuOverlay.classList.remove("active")

      // Re-enable scrolling
      body.style.overflow = ""

      // Remove event listeners
      document.removeEventListener("keydown", handleEscapeKey)
    }, 200)
  }

  // Function to handle escape key press
  const handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      closeMenuFunc()
    }
  }

  // Add event listeners
  menuToggle.addEventListener("click", openMenu)
  closeMenu.addEventListener("click", closeMenuFunc)
  menuOverlay.addEventListener("click", closeMenuFunc)

  // Close menu when clicking on a link
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link")
    if (link) {
      link.addEventListener("click", () => {
        closeMenuFunc()

        // Remove active class from all items
        navItems.forEach((item) => item.classList.remove("active"))

        // Add active class to clicked item
        item.classList.add("active")
      })
    }
  })

  // Handle window resize
  let resizeTimeout
  window.addEventListener("resize", () => {
    // Debounce the resize event
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        closeMenuFunc()
      }
    }, 100)
  })

  // Handle touch swipe to close menu
  let touchStartX = 0
  let touchEndX = 0

  navbar.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    { passive: true },
  )

  navbar.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    },
    { passive: true },
  )

  const handleSwipe = () => {
    // If swiped left (from right to left)
    if (touchStartX - touchEndX > 50 && isMenuOpen) {
      closeMenuFunc()
    }
  }
}

// Function to add shadow to header on scroll and hide on scroll down
function initScrollHeader() {
  const header = document.getElementById("main-header")
  let lastScrollTop = 0
  const scrollThreshold = 10
  let isScrollingUp = true

  if (!header) {
    console.warn("Header element not found")
    return
  }

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop

      // Always add scrolled class if past threshold
      if (currentScroll > scrollThreshold) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }

      // Handle header hiding on scroll down (only if mobile menu is not open)
      if (!document.getElementById("navbar").classList.contains("active")) {
        // Determine scroll direction
        isScrollingUp = currentScroll < lastScrollTop

        // If scrolling down and past threshold, hide header
        if (!isScrollingUp && currentScroll > 100) {
          header.classList.add("hide")
        }
        // If scrolling up, show header
        else if (isScrollingUp) {
          header.classList.remove("hide")
        }
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll // For Mobile or negative scrolling
    },
    { passive: true },
  )
}

// Function to update active state in navigation based on scroll position
function initNavActiveState() {
  const sections = document.querySelectorAll("section[id]")
  const navItems = document.querySelectorAll(".nav-item")

  if (!sections.length || !navItems.length) {
    console.warn("Sections or nav items not found")
    return
  }

  const setActiveNavItem = () => {
    const scrollPosition = window.scrollY + 100 // Offset for better accuracy

    // Find the current section
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all items
        navItems.forEach((item) => {
          item.classList.remove("active")
        })

        // Add active class to corresponding nav item
        const activeNavItem = document.querySelector(`.nav-item a[href="#${sectionId}"]`).parentElement
        if (activeNavItem) {
          activeNavItem.classList.add("active")
        }
      }
    })
  }

  // Set active state on scroll
  window.addEventListener("scroll", setActiveNavItem, { passive: true })

  // Set active state on page load
  window.addEventListener("load", setActiveNavItem)
}

// Function to initialize typing effect
function initTypingEffect() {
  const typingText = document.querySelector(".typing-text")

  if (!typingText) {
    console.warn("Typing text element not found")
    return
  }

  const texts = [
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
  ]

  // Check if Typed.js is loaded
  if (typeof window.Typed !== "undefined") {
    // Using Typed.js for typing animation
    new window.Typed(typingText, {
      strings: texts,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    })
  } else {
    console.warn("Typed.js library not loaded")
    // Fallback: Display the first text without animation
    typingText.textContent = texts[0]
  }
}

// Function to initialize project modal
function initProjectModal() {
  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalDescription = document.getElementById("modal-description")
  const modalFiles = document.getElementById("modal-files")
  const modalLink = document.getElementById("modal-link")
  const closeBtn = document.getElementsByClassName("close")[0]
  const viewDetailsButtons = document.querySelectorAll(".view-details")

  // Check if required elements exist
  if (!modal || !modalTitle || !modalDescription || !modalFiles || !modalLink || !closeBtn) {
    console.warn("Modal elements not found")
    return
  }

  // Project details - Consider moving this to a separate JSON file in a production environment
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
    "E-commerce Website": {
      title: "Excellent KB Events and Hire",
      description:
        "Developed a responsive e-commerce website for a local business using HTML, CSS, and JavaScript. The website includes services offered by the business for various events including weddings, graduations, funerals, and corporate events. Clients are able to see the previous work done by the business and they able to book services they want and check the price estimation. In this project JavaScript is used for price estimator calculator, animations, slideshow gallery,  form Submission with Formspree and back to top button",
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
        "Developed a website that has my details such as contacts. The website has projects i did, skills that i have and my github reposetories. JavaScript is used for theme switching, animation, transitions, data fetching from GitHub repository data, showcasing the user's latest projects and displays language statistics based on the fetched GitHub data. CSS is responsible for the visual presentation and layout of the portfolio, ensuring it looks appealing and functions well across different devices.",
      files: [
        { name: "index.html", description: "Main HTML file" },
        { name: "styles.css", description: "CSS styles for the app" },
        { name: "script.js", description: "JavaScript functionality and API integration" },
      ],
      link: "https://orapeleng-madibela.github.io/my-portfolio/",
    },
  }

  // Check if view details buttons exist
  if (viewDetailsButtons.length === 0) {
    console.warn("No 'View Details' buttons found")
    return
  }

  // Add click event listeners to all "View Details" buttons
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const projectTitleElement = button.parentElement.querySelector("h3")

      if (!projectTitleElement) {
        console.warn("Project title element not found")
        return
      }

      const projectTitle = projectTitleElement.textContent
      const project = projects[projectTitle]

      if (!project) {
        console.warn(`Project details not found for: ${projectTitle}`)
        return
      }

      // Populate modal with project details
      modalTitle.textContent = project.title
      modalDescription.textContent = project.description

      // Clear and populate files list
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

  // Check if required elements exist
  if (!reposSection) {
    console.warn("GitHub repositories section not found")
    return
  }

  // Optional elements check
  const hasLanguageStats = languageStats && languageBar && languageLabels

  // Fetch GitHub repositories
  fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=6`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      reposSection.innerHTML = "" // Clear loading state

      if (!data || data.length === 0) {
        reposSection.innerHTML = "<p>No repositories found.</p>"
        return null // Return null to indicate no data for the next promise
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

      // Only proceed with language stats if the elements exist
      if (hasLanguageStats) {
        // Fetch language statistics
        return Promise.all(
          data.map((repo) =>
            fetch(repo.languages_url)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Failed to fetch languages for ${repo.name}`)
                }
                return res.json()
              })
              .catch((err) => {
                console.warn(`Error fetching languages for ${repo.name}:`, err)
                return {} // Return empty object on error to continue with other repos
              }),
          ),
        )
      }

      return null // Skip language stats if elements don't exist
    })
    .then((languagesData) => {
      if (!languagesData || !hasLanguageStats) return

      // Calculate total bytes for each language
      const languageTotals = {}
      languagesData.forEach((repoLanguages) => {
        Object.entries(repoLanguages).forEach(([language, bytes]) => {
          languageTotals[language] = (languageTotals[language] || 0) + bytes
        })
      })

      const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0)

      if (totalBytes === 0) {
        languageStats.innerHTML = "<p>No language data available.</p>"
        return
      }

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
  return colors[language] || "#808080" // Default to gray if language not in list
}

// Function to initialize particles background
function initParticles() {
  // Check if particlesJS is loaded
  if (typeof window.particlesJS !== "undefined") {
    const particlesContainer = document.getElementById("particles-js")

    if (!particlesContainer) {
      console.warn("Particles container not found")
      return
    }

    window.particlesJS("particles-js", {
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
    console.warn("particles.js library not loaded")
  }
}

// Function to initialize scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".fade-in, .scale-in, .slide-in-left, .slide-in-right")

  if (animatedElements.length === 0) {
    return // No elements to animate
  }

  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    console.warn("IntersectionObserver not supported in this browser")
    // Make all elements visible as fallback
    animatedElements.forEach((element) => element.classList.add("appear"))
    return
  }

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

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
}

// Function to initialize skills animation
function initSkillsAnimation() {
  const progressBars = document.querySelectorAll(".progress-bar")

  if (progressBars.length === 0) {
    return // No progress bars to animate
  }

  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    console.warn("IntersectionObserver not supported in this browser")
    // Animate all progress bars immediately as fallback
    progressBars.forEach((bar) => {
      const percentage = bar.getAttribute("data-percentage")
      const progressBarInner = bar.querySelector(".progress-bar-inner")
      if (progressBarInner) {
        progressBarInner.style.width = `${percentage}%`
      }
    })
    return
  }

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

        if (progressBarInner && percentage) {
          setTimeout(() => {
            progressBarInner.style.width = `${percentage}%`
          }, 200)
        }

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

  if (filterButtons.length === 0 || projects.length === 0) {
    console.warn("Project filter elements not found")
    return
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      if (!filter) {
        console.warn("Filter attribute missing on button")
        return
      }

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter projects
      projects.forEach((project) => {
        const category = project.getAttribute("data-category")

        if (filter === "all" || category === filter) {
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
  const yearElement = document.getElementById("currentYear")

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }
}

// Function to initialize smooth scrolling
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  if (anchorLinks.length === 0) {
    return // No anchor links to handle
  }

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (!targetId) return

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
    })
  })
}

// Function to initialize lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy-load")

  if (lazyImages.length === 0) {
    return // No images to lazy load
  }

  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    console.warn("IntersectionObserver not supported in this browser")
    // Load all images immediately as fallback
    lazyImages.forEach((img) => {
      const src = img.getAttribute("data-src")
      if (src) {
        img.src = src
        img.classList.remove("lazy-load")
      }
    })
    return
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.getAttribute("data-src")

        if (src) {
          img.src = src
          img.classList.remove("lazy-load")
        }

        observer.unobserve(img)
      }
    })
  }, observerOptions)

  lazyImages.forEach((img) => {
    observer.observe(img)
  })
}

// Function to initialize contact form
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  const toast = document.getElementById("toast")

  if (!contactForm || !toast) {
    console.warn("Contact form elements not found")
    return
  }

  const toastMessage = toast.querySelector(".toast-message")
  const successIcon = toast.querySelector(".toast-icon.success")
  const errorIcon = toast.querySelector(".toast-icon.error")

  if (!toastMessage || !successIcon || !errorIcon) {
    console.warn("Toast elements not found")
    return
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const formAction = contactForm.getAttribute("action")

    if (!formAction) {
      console.error("Form action attribute is missing")
      showToast("Form configuration error. Please try again later.", false)
      return
    }

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
        showToast("Message sent successfully!", true)
        // Reset form
        contactForm.reset()
      } else {
        // Show error toast
        showToast("Failed to send message. Please try again.", false)
      }
    } catch (error) {
      console.error("Error sending form:", error)
      // Show error toast
      showToast("Failed to send message. Please try again.", false)
    }
  })

  // Helper function to show toast
  function showToast(message, isSuccess) {
    toastMessage.textContent = message
    successIcon.style.display = isSuccess ? "block" : "none"
    errorIcon.style.display = isSuccess ? "none" : "block"
    toast.classList.add("show")

    // Hide toast after 5 seconds
    setTimeout(() => {
      toast.classList.remove("show")
    }, 5000)
  }
}

function applyAnimationClasses() {
  // Apply fade-in animation to sections
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("fade-in")
  })

  // Apply scale-in animation to skill items
  document.querySelectorAll(".skill").forEach((skill) => {
    skill.classList.add("scale-in")
  })

  // Apply slide-in animations to project items
  document.querySelectorAll(".project").forEach((project, index) => {
    project.classList.add(index % 2 === 0 ? "slide-in-left" : "slide-in-right")
  })

  // Apply fade-in animation to timeline items
  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.add("fade-in")
  })
}

