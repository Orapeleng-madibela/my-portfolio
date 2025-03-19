// Wait for the page to load before running any code
document.addEventListener("DOMContentLoaded", () => {
  // Check if viewport meta tag exists, add if not
  ensureViewportMeta()

  // Run all our functions when the page loads
  setupDarkMode()
  setupTypingEffect()
  setupProjectDetails()
  loadGitHubProjects()
  setupParticlesBackground()
  animateSkillBars()
  filterProjects()
  updateFooterYear()
  setupSmoothScrolling()
  setupMobileMenu()
  setupContactForm()
  makeHeaderSticky()
  highlightActiveNavLink()
  preventContentOverflow()
})

// Function to ensure viewport meta tag exists
function ensureViewportMeta() {
  var viewportMeta = document.querySelector('meta[name="viewport"]')
  if (!viewportMeta) {
    viewportMeta = document.createElement("meta")
    viewportMeta.name = "viewport"
    viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    document.getElementsByTagName("head")[0].appendChild(viewportMeta)
    console.log("Added viewport meta tag")
  }
}

// Function to prevent content overflow on mobile
function preventContentOverflow() {
  // Apply max-width to images
  var images = document.querySelectorAll("img")
  images.forEach((image) => {
    image.style.maxWidth = "100%"
    image.style.height = "auto"
  })

  // Handle tables for mobile
  var tables = document.querySelectorAll("table")
  tables.forEach((table) => {
    var wrapper = document.createElement("div")
    wrapper.style.overflowX = "auto"
    wrapper.style.width = "100%"
    table.parentNode.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })

  // Check for horizontal overflow
  function checkForOverflow() {
    if (document.body.scrollWidth > window.innerWidth) {
      console.log("Horizontal overflow detected")
      // Find offending elements
      var allElements = document.querySelectorAll("*")
      allElements.forEach((el) => {
        if (el.offsetWidth > window.innerWidth) {
          console.log("Overflow element:", el)
          el.style.maxWidth = "100%"
          el.style.boxSizing = "border-box"
        }
      })
    }
  }

  // Run initial check
  checkForOverflow()

  // Run check on window resize
  window.addEventListener("resize", () => {
    checkForOverflow()
  })
}

// Function to set up dark mode toggle
function setupDarkMode() {
  // Get the buttons that toggle dark mode
  var darkModeToggle = document.getElementById("darkModeToggle")
  var darkModeToggleMobile = document.getElementById("darkModeToggleMobile")
  var body = document.body

  // Check if the buttons exist
  if (!darkModeToggle || !darkModeToggleMobile) {
    console.log("Dark mode toggle buttons not found")
    return
  }

  // Function to switch between dark and light mode
  function toggleDarkMode() {
    // If currently in light mode, switch to dark mode
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode")
      localStorage.setItem("lightMode", "false")

      // Change the icons to sun
      darkModeToggle.querySelector("i").className = "fas fa-sun"
      darkModeToggleMobile.querySelector("i").className = "fas fa-sun"
    }
    // If currently in dark mode, switch to light mode
    else {
      body.classList.add("light-mode")
      localStorage.setItem("lightMode", "true")

      // Change the icons to moon
      darkModeToggle.querySelector("i").className = "fas fa-moon"
      darkModeToggleMobile.querySelector("i").className = "fas fa-moon"
    }
  }

  // Add click event to the dark mode buttons
  darkModeToggle.addEventListener("click", (e) => {
    e.preventDefault()
    toggleDarkMode()
  })

  darkModeToggleMobile.addEventListener("click", (e) => {
    e.preventDefault()
    toggleDarkMode()
  })

  // Check if user has a saved preference
  var savedLightMode = localStorage.getItem("lightMode")

  // Apply the saved preference
  if (savedLightMode === "true") {
    body.classList.add("light-mode")
    darkModeToggle.querySelector("i").className = "fas fa-moon"
    darkModeToggleMobile.querySelector("i").className = "fas fa-moon"
  } else if (savedLightMode === "false") {
    body.classList.remove("light-mode")
    darkModeToggle.querySelector("i").className = "fas fa-sun"
    darkModeToggleMobile.querySelector("i").className = "fas fa-sun"
  } else {
    // If no preference is saved, check system preference
    var prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (!prefersDarkMode) {
      body.classList.add("light-mode")
      darkModeToggle.querySelector("i").className = "fas fa-moon"
      darkModeToggleMobile.querySelector("i").className = "fas fa-moon"
    }
  }
}

// Function to set up mobile menu
function setupMobileMenu() {
  // Get all the elements we need
  var menuToggle = document.getElementById("menuToggle")
  var closeMenu = document.getElementById("closeMenu")
  var navbar = document.getElementById("navbar")
  var menuOverlay = document.getElementById("menuOverlay")
  var navItems = document.querySelectorAll(".nav-item")
  var navLinks = document.querySelectorAll(".nav-link")
  var mobileMenuYear = document.getElementById("mobileMenuYear")
  var body = document.body
  var menuOpen = false

  // Check if elements exist
  if (!menuToggle || !navbar || !menuOverlay) {
    console.log("Mobile menu elements not found")
    return
  }

  // Set current year in mobile menu footer
  if (mobileMenuYear) {
    mobileMenuYear.textContent = new Date().getFullYear()
  }

  // Function to open the menu
  function openMenu() {
    if (menuOpen) return

    menuOpen = true
    menuToggle.classList.add("active")
    menuToggle.setAttribute("aria-expanded", "true")

    // Show overlay first
    menuOverlay.style.display = "block"

    // Force reflow to ensure transitions work
    void menuOverlay.offsetWidth

    // Then add active classes and animate
    menuOverlay.classList.add("active")
    menuOverlay.style.opacity = "1"

    // Show navbar
    navbar.style.display = "block"
    navbar.classList.add("active")

    // Force reflow for navbar animation
    void navbar.offsetWidth

    // Animate navbar in
    navbar.style.right = "0"

    // Stagger nav items animation for better effect
    navItems.forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateX(20px)"

      setTimeout(
        () => {
          item.style.opacity = "1"
          item.style.transform = "translateX(0)"
        },
        50 * (index + 1),
      )
    })

    // Prevent scrolling when menu is open
    body.style.overflow = "hidden"

    // Add touch capability for swiping menu closed
    setupSwipeToClose()
  }

  // Function to close the menu with improved animation
  function closeMenuFunc() {
    if (!menuOpen) return

    menuOpen = false
    menuToggle.classList.remove("active")
    menuToggle.setAttribute("aria-expanded", "false")

    // Hide nav items with staggered animation
    navItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "0"
        item.style.transform = "translateX(20px)"
      }, 30 * index)
    })

    // Animate navbar out
    navbar.style.right = "calc(-1 * var(--nav-width-mobile, 80vw))"

    // Fade out overlay
    menuOverlay.style.opacity = "0"

    // Wait for animations to complete before hiding elements
    setTimeout(() => {
      navbar.classList.remove("active")
      navbar.style.display = "none"
      menuOverlay.classList.remove("active")
      menuOverlay.style.display = "none"

      // Re-enable scrolling
      body.style.overflow = ""

      // Reset nav items for next opening
      navItems.forEach((item) => {
        item.style.opacity = "0"
        item.style.transform = "translateX(20px)"
      })
    }, 300) // Match this with your CSS transition time
  }

  // Add click events to buttons
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    openMenu()
  })

  if (closeMenu) {
    closeMenu.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      closeMenuFunc()
    })
  }

  menuOverlay.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    closeMenuFunc()
  })

  // Improved navigation from mobile menu
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Get the target section id
      var targetId = link.getAttribute("href")

      if (targetId && targetId.startsWith("#")) {
        e.preventDefault()
        e.stopPropagation()

        // Store the target for use after menu closes
        var targetElement = document.querySelector(targetId)

        if (!targetElement) {
          console.log("Target section not found:", targetId)
          closeMenuFunc()
          return
        }

        // Close the mobile menu first
        closeMenuFunc()

        // Wait for menu close animation to complete
        setTimeout(() => {
          // Calculate position accounting for header
          var header = document.querySelector("header")
          var headerHeight = header ? header.offsetHeight : 0
          var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

          // Scroll to the section
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Update active nav item
          navItems.forEach((navItem) => {
            navItem.classList.remove("active")
          })

          // Find the parent nav-item and add active class
          var parentItem = link.closest(".nav-item")
          if (parentItem) {
            parentItem.classList.add("active")
          }
        }, 350) // Slightly longer than the menu close animation
      }
    })
  })

  // Setup touch swipe to close menu
  function setupSwipeToClose() {
    var startX, startY
    var threshold = 100 // Minimum distance for swipe
    var restraint = 100 // Maximum perpendicular distance

    function handleTouchStart(e) {
      if (!menuOpen) return

      var touch = e.changedTouches[0]
      startX = touch.pageX
      startY = touch.pageY
    }

    function handleTouchEnd(e) {
      if (!menuOpen) return

      var touch = e.changedTouches[0]
      var distX = touch.pageX - startX
      var distY = Math.abs(touch.pageY - startY)

      // Check for swipe right (to close menu)
      if (distX > threshold && distY < restraint) {
        closeMenuFunc()
      }
    }

    // Add event listeners
    navbar.addEventListener("touchstart", handleTouchStart, { passive: true })
    navbar.addEventListener("touchend", handleTouchEnd, { passive: true })

    // Clean up function to remove listeners when menu closes
    setTimeout(() => {
      if (!menuOpen) {
        navbar.removeEventListener("touchstart", handleTouchStart)
        navbar.removeEventListener("touchend", handleTouchEnd)
      }
    }, 300)
  }

  // Close menu when window is resized to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && menuOpen) {
      closeMenuFunc()
    }
  })

  // Close menu with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenuFunc()
    }
  })
}

// Function to make header sticky on scroll
function makeHeaderSticky() {
  var header = document.getElementById("main-header")

  if (!header) {
    console.log("Header not found")
    return
  }

  // Add shadow to header when scrolled
  window.addEventListener("scroll", () => {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop

    if (currentScroll > 10) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

// Function to highlight active navigation link based on scroll position
function highlightActiveNavLink() {
  var sections = document.querySelectorAll("section[id]")
  var navItems = document.querySelectorAll(".nav-item")

  if (!sections.length || !navItems.length) {
    console.log("Sections or nav items not found")
    return
  }

  // Function to update active nav item
  function updateActiveNavItem() {
    var scrollPosition = window.scrollY + 100 // Add offset for better accuracy

    // Check each section to see if we're in it
    sections.forEach((section) => {
      var sectionTop = section.offsetTop
      var sectionHeight = section.offsetHeight
      var sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all items
        navItems.forEach((item) => {
          item.classList.remove("active")
        })

        // Add active class to current section's nav item
        var activeNavItem = document.querySelector('.nav-item a[href="#' + sectionId + '"]')
        if (activeNavItem) {
          activeNavItem.parentElement.classList.add("active")
        }
      }
    })
  }

  // Update active nav item on scroll
  window.addEventListener("scroll", updateActiveNavItem)

  // Update active nav item on page load
  window.addEventListener("load", updateActiveNavItem)
}

// Function to set up typing effect
function setupTypingEffect() {
  var typingText = document.querySelector(".typing-text")

  if (!typingText) {
    console.log("Typing text element not found")
    return
  }

  // List of texts to display
  var texts = [
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
  if (typeof Typed !== "undefined") {
    // Create typing animation
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
  } else {
    console.log("Typed.js not loaded, showing static text")
    typingText.textContent = texts[0]
  }
}

// Function to set up project details modal
function setupProjectDetails() {
  var modal = document.getElementById("modal")
  var modalTitle = document.getElementById("modal-title")
  var modalDescription = document.getElementById("modal-description")
  var modalFiles = document.getElementById("modal-files")
  var modalLink = document.getElementById("modal-link")
  var closeBtn = document.getElementsByClassName("close")[0]
  var viewDetailsButtons = document.querySelectorAll(".view-details")

  // Check if elements exist
  if (!modal || !modalTitle || !modalDescription || !modalFiles || !modalLink || !closeBtn) {
    console.log("Modal elements not found")
    return
  }

  // Project details
  var projects = {
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
        "Developed a responsive e-commerce website for a local business using HTML, CSS, and JavaScript. The website includes services offered by the business for various events including weddings, graduations, funerals, and corporate events. Clients are able to see the previous work done by the business and they able to book services they want and check the price estimation. In this project JavaScript is used for price estimator calculator, animations, slideshow gallery, form Submission with Formspree and back to top button",
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
    "Orapeleng Creative Webs": {
      title: "Orapeleng Creative Webs",
      description:
        "Designed and developed a creative web design agency website showcasing services, portfolio, and client testimonials. The site features a modern, responsive design with smooth animations and interactive elements. Built with HTML, CSS, and JavaScript, it demonstrates my skills in creating professional business websites with attention to user experience and visual appeal.",
      files: [
        { name: "index.html", description: "Main HTML file" },
        { name: "styles.css", description: "CSS styles for the website" },
        { name: "script.js", description: "JavaScript functionality and animations" },
        { name: "portfolio.js", description: "Portfolio showcase functionality" },
      ],
      link: "https://orapelengcreativewebs.netlify.app/",
    },
  }

  // Make modal responsive for mobile
  function makeModalResponsive() {
    var modalContent = modal.querySelector(".modal-content")
    if (modalContent) {
      modalContent.style.width = window.innerWidth <= 768 ? "90%" : "70%"
      modalContent.style.maxHeight = window.innerWidth <= 768 ? "80vh" : "80vh"
      modalContent.style.overflowY = "auto"
    }
  }

  // Run initially and on resize
  makeModalResponsive()
  window.addEventListener("resize", makeModalResponsive)

  // Add click event to all "View Details" buttons
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      var projectTitle = button.parentElement.querySelector("h3").textContent
      var project = projects[projectTitle]

      if (!project) {
        console.log("Project details not found for: " + projectTitle)
        return
      }

      // Fill modal with project details
      modalTitle.textContent = project.title
      modalDescription.textContent = project.description

      // Clear and fill files list
      modalFiles.innerHTML = ""
      if (project.files && project.files.length > 0) {
        var filesList = document.createElement("ul")
        project.files.forEach((file) => {
          var listItem = document.createElement("li")
          listItem.innerHTML = "<strong>" + file.name + "</strong>: " + file.description
          filesList.appendChild(listItem)
        })
        modalFiles.appendChild(filesList)
      }

      // Clear and fill project link
      modalLink.innerHTML = ""
      if (project.link) {
        var link = document.createElement("a")
        link.href = project.link
        link.innerHTML = '<i class="fas fa-external-link-alt"></i> View Live Project'
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        modalLink.appendChild(link)
      }

      // Show modal
      modal.style.display = "block"
      makeModalResponsive() // Ensure modal is properly sized
      document.body.style.overflow = "hidden" // Prevent scrolling
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

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none"
      document.body.style.overflow = "" // Re-enable scrolling
    }
  })

  // Support touch swipe to dismiss modal
  var startX, startY
  var threshold = 50

  modal.addEventListener(
    "touchstart",
    (e) => {
      var touch = e.changedTouches[0]
      startX = touch.pageX
      startY = touch.pageY
    },
    { passive: true },
  )

  modal.addEventListener(
    "touchend",
    (e) => {
      var touch = e.changedTouches[0]
      var distX = Math.abs(touch.pageX - startX)
      var distY = Math.abs(touch.pageY - startY)

      if (distX > threshold || distY > threshold) {
        modal.style.display = "none"
        document.body.style.overflow = ""
      }
    },
    { passive: true },
  )
}

// Function to load GitHub repositories and language statistics
function loadGitHubProjects() {
  // My GitHub username
  var githubUsername = "Orapeleng-madibela"

  // Get the elements where we'll show the GitHub data
  var reposSection = document.getElementById("repos")
  var languageStats = document.getElementById("language-stats")
  var githubError = document.getElementById("github-error")
  var retryButton = document.getElementById("retry-github")

  // Check if repos section exists
  if (!reposSection) {
    console.log("GitHub repositories section not found")
    return
  }

  // Function to show loading state
  function showLoading() {
    if (githubError) {
      githubError.style.display = "none"
    }

    reposSection.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading repositories...</p>
      </div>
    `

    // Check if language stats element exists
    if (languageStats) {
      languageStats.innerHTML = "<h3>Language Statistics</h3><p>Loading language statistics...</p>"
    }
  }

  // Show loading initially
  showLoading()

  // Function to show error state
  function showError() {
    if (githubError) {
      githubError.style.display = "block"
    }
  }

  // Add retry functionality
  if (retryButton) {
    retryButton.addEventListener("click", () => {
      showLoading()
      fetchGitHubData()
    })
  }

  // Fallback data in case GitHub API fails
  var fallbackRepos = [
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
  ]

  // Fallback language data
  var fallbackLanguages = {
    JavaScript: 40,
    HTML: 30,
    CSS: 20,
    Python: 10,
  }

  // Function to show repositories
  function showRepositories(repos) {
    if (!reposSection) return

    reposSection.innerHTML = ""

    if (repos.length === 0) {
      reposSection.innerHTML = "<p>No repositories found.</p>"
      return
    }

    // Create repository cards
    repos.forEach((repo) => {
      var repoElement = document.createElement("div")
      repoElement.classList.add("repo")

      // Format the date
      var updatedDate = new Date(repo.updated_at).toLocaleDateString()

      repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <div class="repo-meta">
          <span>Updated: ${updatedDate}</span>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      `

      reposSection.appendChild(repoElement)
    })
  }

  // Function to show language statistics
  function showLanguageStats(languages) {
    if (!languageStats) return

    // Clear and rebuild language stats section
    languageStats.innerHTML = "<h3>Language Statistics</h3>"

    if (!languages || Object.keys(languages).length === 0) {
      languageStats.innerHTML += "<p>No language data available.</p>"
      return
    }

    // Create language bar
    var languageBar = document.createElement("div")
    languageBar.className = "language-bar"

    // Create language labels container
    var languageLabels = document.createElement("div")
    languageLabels.className = "language-labels"

    // Calculate total bytes
    var totalBytes = 0
    Object.keys(languages).forEach((language) => {
      totalBytes += languages[language]
    })

    // Sort languages by usage (most used first)
    var sortedLanguages = Object.keys(languages).sort((a, b) => languages[b] - languages[a])

    // Create language statistics visualization
    sortedLanguages.forEach((language) => {
      var bytes = languages[language]
      var percentage = ((bytes / totalBytes) * 100).toFixed(1)

      // Create language segment in bar
      var segment = document.createElement("div")
      segment.className = "language-segment"
      segment.style.width = percentage + "%"
      segment.style.backgroundColor = getLanguageColor(language)
      segment.title = language + ": " + percentage + "%"
      languageBar.appendChild(segment)

      // Create language label
      var label = document.createElement("div")
      label.className = "language-label"

      var colorBox = document.createElement("div")
      colorBox.className = "language-color"
      colorBox.style.backgroundColor = getLanguageColor(language)

      var text = document.createElement("span")
      text.textContent = language + ": " + percentage + "%"

      label.appendChild(colorBox)
      label.appendChild(text)
      languageLabels.appendChild(label)
    })

    // Add language bar and labels to the stats section
    languageStats.appendChild(languageBar)
    languageStats.appendChild(languageLabels)
  }

  // Function to fetch GitHub data
  function fetchGitHubData() {
    // Use a timeout to simulate network delay and handle potential timeouts
    var fetchTimeout = setTimeout(() => {
      console.log("GitHub API request timed out")
      showRepositories(fallbackRepos)
      showLanguageStats(fallbackLanguages)
      showError()
    }, 10000) // 10 second timeout

    // Fetch repositories from GitHub
    fetch("https://api.github.com/users/" + githubUsername + "/repos?sort=updated&direction=desc&per_page=6")
      .then((response) => {
        clearTimeout(fetchTimeout) // Clear the timeout

        if (!response.ok) {
          throw new Error("GitHub API error: " + response.status)
        }
        return response.json()
      })
      .then((data) => {
        if (!data || data.length === 0) {
          throw new Error("No repositories found")
        }

        // Show repositories
        showRepositories(data)

        // If we have language stats element, fetch language data
        if (languageStats) {
          // Use a simple approach: just use the first repo's languages as a sample
          if (data[0] && data[0].languages_url) {
            return fetch(data[0].languages_url)
          }
        }
      })
      .then((response) => {
        if (!response || !response.ok) {
          throw new Error("Error fetching languages")
        }
        return response.json()
      })
      .then((languages) => {
        if (languages && Object.keys(languages).length > 0) {
          showLanguageStats(languages)
        } else {
          showLanguageStats(fallbackLanguages)
        }
      })
      .catch((error) => {
        console.log("Error loading GitHub data:", error)
        showRepositories(fallbackRepos)
        showLanguageStats(fallbackLanguages)
        showError()
      })
  }

  // Start fetching GitHub data
  fetchGitHubData()
}

// Function to get color for programming language
function getLanguageColor(language) {
  // Colors for different programming languages
  var colors = {
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
function setupParticlesBackground() {
  // Check if particlesJS is loaded
  if (typeof particlesJS !== "undefined") {
    var particlesContainer = document.getElementById("particles-js")

    if (!particlesContainer) {
      console.log("Particles container not found")
      return
    }

    // Reduce particle count on mobile for better performance
    var particleCount = window.innerWidth < 768 ? 30 : 80

    // Initialize particles
    particlesJS("particles-js", {
      particles: {
        number: { value: particleCount, density: { enable: true, value_area: 800 } },
        color: { value: "#4a00e0" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#8e2de2", opacity: 0.4, width: 1 },
        move: {
          enable: true,
          speed: window.innerWidth < 768 ? 3 : 6, // Slower on mobile
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
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: window.innerWidth < 768 ? 100 : 200, duration: 0.4 },
          push: { particles_nb: window.innerWidth < 768 ? 2 : 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    })

    // Update particle density on resize
    window.addEventListener("resize", () => {
      if (typeof pJSDom !== "undefined" && pJSDom.length > 0) {
        pJSDom[0].pJS.particles.number.value = window.innerWidth < 768 ? 30 : 80
        pJSDom[0].pJS.particles.move.speed = window.innerWidth < 768 ? 3 : 6
        pJSDom[0].pJS.fn.particlesRefresh()
      }
    })
  } else {
    console.log("particles.js library not loaded")
  }
}

// Function to animate skill bars when they come into view
function animateSkillBars() {
  var progressBars = document.querySelectorAll(".progress-bar")

  if (progressBars.length === 0) {
    return // No progress bars to animate
  }

  // Function to check if an element is in the viewport
  function isInViewport(element) {
    var rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  // Function to animate progress bars in viewport
  function animateVisibleBars() {
    progressBars.forEach((bar) => {
      if (isInViewport(bar) && !bar.classList.contains("animated")) {
        var percentage = bar.getAttribute("data-percentage")
        var progressBarInner = bar.querySelector(".progress-bar-inner")

        if (progressBarInner && percentage) {
          setTimeout(() => {
            progressBarInner.style.width = percentage + "%"
          }, 200)

          bar.classList.add("animated")
        }
      }
    })
  }

  // Animate on scroll
  window.addEventListener("scroll", animateVisibleBars)

  // Animate on page load
  window.addEventListener("load", animateVisibleBars)

  // Also animate on orientation change for mobile
  window.addEventListener("orientationchange", () => {
    // Wait for orientation change to complete
    setTimeout(animateVisibleBars, 300)
  })
}

// Function to filter projects by category
function filterProjects() {
  var filterButtons = document.querySelectorAll(".filter-btn")
  var projects = document.querySelectorAll(".project")

  if (filterButtons.length === 0 || projects.length === 0) {
    console.log("Project filter elements not found")
    return
  }

  // Make filter buttons scrollable on mobile
  var filterContainer = filterButtons[0].parentElement
  if (filterContainer) {
    filterContainer.style.overflowX = "auto"
    filterContainer.style.whiteSpace = "nowrap"
    filterContainer.style.WebkitOverflowScrolling = "touch"
    filterContainer.style.scrollbarWidth = "none" // Firefox
    filterContainer.style.msOverflowStyle = "none" // IE/Edge

    // Hide scrollbar in webkit browsers
    filterContainer.style.cssText += `
      ::-webkit-scrollbar {
        display: none;
      }
    `

    // Add padding for better mobile experience
    filterContainer.style.padding = "5px 0"
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      var filter = button.getAttribute("data-filter")

      if (!filter) {
        console.log("Filter attribute missing on button")
        return
      }

      // Update active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      button.classList.add("active")

      // Filter projects
      projects.forEach((project) => {
        var category = project.getAttribute("data-category")

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

// Function to update the year in the footer
function updateFooterYear() {
  var yearElement = document.getElementById("currentYear")

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }
}

// Function to set up smooth scrolling for anchor links
function setupSmoothScrolling() {
  var anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)')

  if (anchorLinks.length === 0) {
    return // No anchor links to handle
  }

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      var targetId = this.getAttribute("href")
      if (!targetId) return

      var targetElement = document.querySelector(targetId)

      if (targetElement) {
        var header = document.querySelector("header")
        var headerHeight = header ? header.offsetHeight : 0
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        // Scroll to the target element
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Function to set up contact form
function setupContactForm() {
  var contactForm = document.getElementById("contactForm")
  var toast = document.getElementById("toast")

  if (!contactForm || !toast) {
    console.log("Contact form elements not found")
    return
  }

  var toastMessage = toast.querySelector(".toast-message")
  var successIcon = toast.querySelector(".toast-icon.success")
  var errorIcon = toast.querySelector(".toast-icon.error")

  if (!toastMessage || !successIcon || !errorIcon) {
    console.log("Toast elements not found")
    return
  }

  // Make form inputs more mobile-friendly
  var formInputs = contactForm.querySelectorAll("input, textarea")
  formInputs.forEach((input) => {
    input.style.fontSize = "16px" // Prevents zoom on iOS

    // Add touch-specific styling
    input.addEventListener("focus", function () {
      this.style.outline = "none"
      this.style.boxShadow = "0 0 0 2px var(--accent-color, #8e2de2)"
    })

    input.addEventListener("blur", function () {
      this.style.boxShadow = "none"
    })
  })

  // Position toast for mobile
  function positionToast() {
    if (window.innerWidth <= 768) {
      toast.style.width = "calc(100% - 32px)"
      toast.style.bottom = "20px"
      toast.style.left = "16px"
      toast.style.right = "16px"
    } else {
      toast.style.width = "auto"
      toast.style.bottom = "30px"
      toast.style.right = "30px"
      toast.style.left = "auto"
    }
  }

  // Run initially and on resize
  positionToast()
  window.addEventListener("resize", positionToast)

  // Hide toast initially
  toast.classList.remove("show")
  toast.style.opacity = "0"
  toast.style.visibility = "hidden"

  // Add submit event to form
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Check form validation on mobile
    var isValid = true
    formInputs.forEach((input) => {
      if (input.required && !input.value.trim()) {
        isValid = false
        input.style.borderColor = "red"

        // Add shake animation effect
        input.classList.add("shake")
        setTimeout(() => {
          input.classList.remove("shake")
        }, 500)
      } else {
        input.style.borderColor = ""
      }
    })

    if (!isValid) {
      showToast("Please fill in all required fields.", false)
      return
    }

    var formData = new FormData(contactForm)
    var formAction = contactForm.getAttribute("action")

    if (!formAction) {
      console.log("Form action attribute is missing")
      showToast("Form configuration error. Please try again later.", false)
      return
    }

    // Show loading state
    var submitButton = contactForm.querySelector('button[type="submit"]')
    if (submitButton) {
      var originalText = submitButton.textContent
      submitButton.disabled = true
      submitButton.textContent = "Sending..."
    }

    // Send form data
    fetch(formAction, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Show success message
          showToast("Message sent successfully!", true)
          // Reset form
          contactForm.reset()
        } else {
          // Show error message
          showToast("Failed to send message. Please try again.", false)
        }
      })
      .catch((error) => {
        console.log("Error sending form:", error)
        // Show error message
        showToast("Failed to send message. Please try again.", false)
      })
      .finally(() => {
        // Reset button state
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }
      })
  })

  // Function to show toast notification
  function showToast(message, isSuccess) {
    toastMessage.textContent = message
    successIcon.style.display = isSuccess ? "block" : "none"
    errorIcon.style.display = isSuccess ? "none" : "block"

    // Remove any existing show class and timeout
    toast.classList.remove("show")
    clearTimeout(toast.timeout)

    // Show the toast
    toast.style.opacity = "1"
    toast.style.visibility = "visible"
    toast.classList.add("show")

    // Hide toast after 5 seconds
    toast.timeout = setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.style.opacity = "0"
        toast.style.visibility = "hidden"
      }, 300)
    }, 5000)

    // Allow dismiss on touch
    toast.addEventListener(
      "click",
      () => {
        toast.classList.remove("show")
        setTimeout(() => {
          toast.style.opacity = "0"
          toast.style.visibility = "hidden"
        }, 300)
      },
      { once: true },
    )
  }
}

// Declare Typed variable
var Typed

// Declare particlesJS variable
var particlesJS

// Declare pJSDom variable
var pJSDom

