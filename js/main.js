// Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Portfolio filtering
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        portfolioFilters.forEach(f => f.classList.remove('active'));
        // Add active class to clicked filter
        filter.classList.add('active');
        
        const category = filter.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 0);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Image click handler for portfolio items
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${imgSrc}" alt="Portfolio Image">
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal when clicking outside or on close button
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('image-modal') || 
                e.target.classList.contains('close-modal')) {
                modal.remove();
            }
        });
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Clear form
    contactForm.reset();
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
});

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Typing animation for hero section
const heroText = document.querySelector('.hero-content h1');
const text = heroText.textContent;
heroText.textContent = '';

let i = 0;
function typeWriter() {
    if (i < text.length) {
        heroText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation when page loads
window.addEventListener('load', typeWriter);

// Image Preloading System
function preloadAllImages() {
    const images = document.querySelectorAll('.portfolio-item img');
    const loadedImages = new Set();
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-progress';
    progressContainer.innerHTML = '<div class="loading-progress-bar"></div>';
    document.body.appendChild(progressContainer);
    
    const progressBar = progressContainer.querySelector('.loading-progress-bar');
    
    images.forEach((img, index) => {
        // Add loading indicator
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Create preloader
        const preloader = new Image();
        preloader.onload = function() {
            img.style.opacity = '1';
            img.classList.add('loaded');
            loadedImages.add(img.src);
            
            // Update progress
            const progress = ((loadedImages.size / images.length) * 100).toFixed(0);
            progressBar.style.width = progress + '%';
            
            // Hide progress when complete
            if (loadedImages.size === images.length) {
                setTimeout(() => {
                    progressContainer.classList.add('loading-complete');
                    setTimeout(() => {
                        progressContainer.remove();
                    }, 500);
                }, 500);
            }
        };
        
        preloader.onerror = function() {
            img.style.opacity = '1';
            img.classList.add('loaded');
            loadedImages.add(img.src);
            
            // Update progress even on error
            const progress = ((loadedImages.size / images.length) * 100).toFixed(0);
            progressBar.style.width = progress + '%';
        };
        
        // Start preloading
        preloader.src = img.src;
    });
}

// Image Caching System
function setupImageCaching() {
    const images = document.querySelectorAll('.portfolio-item img');
    
    images.forEach(img => {
        // Check if image is already cached
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
            img.classList.add('loaded');
        } else {
            // Image not cached, will be loaded by preloader
            img.style.opacity = '0';
        }
    });
}

// Intersection Observer for lazy loading
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize image loading when page loads
window.addEventListener('load', () => {
    setupImageCaching();
    preloadAllImages();
    setupLazyLoading();
});

// Preload images immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupImageCaching();
    preloadAllImages();
    setupContactForm();
});

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Initialize EmailJS
        emailjs.init("user_1234567890abcdef");
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const templateParams = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    phone: formData.get('phone'),
                    photography_type: formData.get('photography_type'),
                    message: formData.get('message'),
                    to_email: 'ouse3709@gmail.com'
                };
                
                // Direct Gmail approach - take client to Gmail
                const name = formData.get('name');
                const email = formData.get('email');
                const phone = formData.get('phone');
                const photographyType = formData.get('photography_type');
                const message = formData.get('message');
                
                const emailSubject = `New Photography Inquiry - ${photographyType}`;
                const emailBody = `
Dear Eternals Media,

I am interested in your photography services.

My Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Photography Type: ${photographyType}
Message: ${message}

Please contact me for booking and pricing details.

Thank you!

---
This message was sent from Eternals Media Portfolio Website
                `;
                
                // Create Gmail compose URL - client will send from their email to ouse3709@gmail.com
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ouse3709@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Universal approach - works on all devices
                const mailtoLink = `mailto:ouse3709@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Universal approach - works on all devices and browsers
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const isDesktop = window.innerWidth > 768;
                
                if (isDesktop && !isMobile) {
                    // Desktop: Try Gmail web interface first
                    const gmailWindow = window.open(gmailUrl, '_blank');
                    if (gmailWindow) {
                        showMessage('Gmail opened! Please send the email from your account to ouse3709@gmail.com', 'success');
                    } else {
                        // Fallback to mailto
                        window.location.href = mailtoLink;
                        showMessage('Email client opened! Please send to ouse3709@gmail.com', 'success');
                    }
                } else {
                    // Mobile: Use mailto directly (most reliable)
                    window.location.href = mailtoLink;
                    showMessage('Email app opened! Please send to ouse3709@gmail.com', 'success');
                }
                
                contactForm.reset();
                
            } catch (error) {
                // Error message
                showMessage('Sorry, there was an error. Please contact me directly at +91 7405884907', 'error');
            } finally {
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Show message to user
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
    } else {
        messageDiv.style.backgroundColor = '#f44336';
    }
    
    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for image modal
const style = document.createElement('style');
style.textContent = `
    .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    }

    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90vh;
    }

    .modal-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }

    .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }
`;
document.head.appendChild(style); 