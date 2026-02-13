// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-button');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
});

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            const submitBtn = newsletterForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .about-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add floating animation to diamond shape
document.addEventListener('DOMContentLoaded', function() {
    const diamondShape = document.querySelector('.diamond-shape');
    
    if (diamondShape) {
        // Add random floating particles
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = 'hsl(207, 90%, 54%)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const duration = 10000 + Math.random() * 10000;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    particle.style.top = (window.innerHeight - (progress * (window.innerHeight + 100))) + 'px';
                    particle.style.left = (parseFloat(particle.style.left) + (Math.sin(progress * Math.PI * 4) * 2)) + 'px';
                    particle.style.opacity = Math.sin(progress * Math.PI);
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        };
        
        // Create particles periodically
        setInterval(createParticle, 2000);
    }
});

// Page transition effects
document.addEventListener('DOMContentLoaded', function() {
    // Fade in page content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});



// Add loading animation
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading class after content is loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Add dynamic copyright year
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.footer-bottom p');
    
    if (copyrightText) {
        copyrightText.textContent = `© ${currentYear} OptiDot. All rights reserved.`;
    }
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or use preferred scheme
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon
    updateThemeIcon(currentTheme);
    
    // Desktop toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Mobile toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
        const elements = document.querySelectorAll('.theme-toggle i');
        
        elements.forEach(el => {
            el.className = `fas ${icon}`;
        });
        
        if (mobileThemeToggle) {
            mobileThemeToggle.innerHTML = `<i class="fas ${icon}"></i> Toggle Theme`;
        }
    }
});


// For email
function sendEmail() {
      const email = "optidotdigital@gmail.com";
      const subject = encodeURIComponent("Collaboration with OptiDot Digital");
      const body = encodeURIComponent(
        "Hello OptiDot Team,\n\n" +
        `I want to begin by saying that I’m genuinely impressed by the quality and professionalism of your services. The way your team presents and delivers your offerings reflects a strong commitment to excellence, and that’s something I deeply value. After going through your work, I feel inspired and curious to learn more about your company, your vision, and the people behind it.

        With that in mind, I would really appreciate the opportunity to have a conversation with you — either through a virtual meeting or any form of communication that works best for you. I believe there is a strong potential for us to collaborate, and I’m eager to explore how we might work together in a way that’s meaningful and mutually beneficial. Whether it’s for a specific project or a long-term partnership, I’d love to hear your thoughts and ideas as well.

        Thank you once again for the work you do and for the impact you're making in your space. I look forward to connecting soon and starting a productive conversation.\n\n` +
        "Regards,\n[Your Name]"
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");
    }
// For phone call
function isMobileDevice() {
      return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    }

    function makeCall() {
      const phoneNumber = "+9779767457243";
      const messageBox = document.getElementById("message");

      if (isMobileDevice()) {
        // Works on mobile: open dialer with number
        window.location.href = `tel:${phoneNumber}`;
      } else {
        // On desktop: show message
        messageBox.textContent = " Phone call is not available in desktop, please open in your mobile.";
      }
    }
// For WhatsApp
function isMobileDevice() {
      return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    }

    function openWhatsApp() {
      const phoneNumber = "9779767457243"; // No '+' or '00' prefix here
      const message = encodeURIComponent("Hey OptiDot team! I'm interested in your services.");
      const messageBox = document.getElementById("message");

      let url;

      if (isMobileDevice()) {
        // Mobile: Open WhatsApp app
        url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      } else {
        // Desktop: Open WhatsApp Web
        url = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        messageBox.textContent = "Redirecting you to WhatsApp Web...";
      }

      // Open WhatsApp
      window.open(url, '_blank');
    }