// Global variables
let map;
let marker;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    updateCurrentYear();
});

// Main initialization function
function initializeWebsite() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupScrollEffects();
    setupFormHandlers();
    setupAnimations();
    setupStatsAnimation();
    initializeMap();
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function setupScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .team-member, .testimonial-card, .contact-method'
    );

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Leaflet Maps Integration
function initializeMap() {
    // Coordinates for office location
    const officeLocation = [22.822167, 86.176833];

    try {
        // Initialize the map
        map = L.map('map', {
            center: officeLocation,
            zoom: 15,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add OpenStreetMap tile layer (free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Custom marker icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    width: 40px;
                    height: 40px;
                    background: #1a294a;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    border: 3px solid white;
                ">
                    <i class="fas fa-balance-scale" style="color: #f39c12; font-size: 16px;"></i>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add marker
        marker = L.marker(officeLocation, {
            icon: customIcon,
            title: 'JurisEdge Law Firm'
        }).addTo(map);

        // Popup content
        const popupContent = `
            <div style="padding: 15px; max-width: 280px; font-family: 'Open Sans', sans-serif;">
                <h3 style="color: #1a294a; margin: 0 0 10px 0; font-size: 18px; font-weight: 700;">JurisEdge Law Firm</h3>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                    <i class="fas fa-map-marker-alt" style="color: #f39c12; margin-right: 5px;"></i>
                    375, B-Block, Near Old CPN Club, Sonari, Jamshedpur, Jharkhand
                </p>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                    <i class="fas fa-phone" style="color: #f39c12; margin-right: 5px;"></i>
                    <strong>Phone:</strong> +91-7561960118
                </p>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                    <i class="fas fa-clock" style="color: #f39c12; margin-right: 5px;"></i>
                    <strong>Hours:</strong> Mon-Sat 9AM-6PM
                </p>
                <div style="margin-top: 15px; text-align: center;">
                    <a href="tel:+917561960118" style="background: #f39c12; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px; font-weight: 600;">
                        <i class="fas fa-phone"></i> Call Now
                    </a>
                </div>
            </div>
        `;

        // Bind popup to marker
        marker.bindPopup(popupContent, {
            maxWidth: 320,
            className: 'custom-popup'
        });

        // Open popup by default
        marker.openPopup();

        // Add click event for directions
        marker.on('click', function() {
            trackEvent('map_marker_click');
        });

        // Add map click event to open directions
        map.on('click', function() {
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation[0]},${officeLocation[1]}`;
            window.open(directionsUrl, '_blank');
        });

        console.log('Leaflet map initialized successfully');

    } catch (error) {
        console.log('Leaflet map failed to load, showing fallback');
        showMapFallback();
    }
}

// Fallback when map fails to load
function showMapFallback() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div class="map-loading">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                    <h3>JurisEdge Law Firm</h3>
                    <p>375, B-Block, Near Old CPN Club, Sonari, Jamshedpur, Jharkhand 831011</p>
                    <a href="https://maps.google.com/?q=22.822167,86.176833" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-external-link-alt"></i> Open in Google Maps
                    </a>
                </div>
            </div>
        `;
    }
}

// Appointment Modal Functions
function openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Set minimum date to today
        const dateInput = modal.querySelector('input[type="date"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target === modal) {
        closeAppointmentModal();
    }
});

// Form handlers
function setupFormHandlers() {
    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Appointment form handler
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentForm);
    }

    // Phone number formatting
    setupPhoneFormatting();
}

function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formEntries = Object.fromEntries(formData);

    // Show success message
    showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success');

    // Reset form
    e.target.reset();

    // In a real implementation, you would send this data to your server
    console.log('Contact form submission:', formEntries);
}

function handleAppointmentForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formEntries = Object.fromEntries(formData);

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(formEntries);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/917561960118?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Show success message
    showNotification('Appointment request sent! We will confirm via WhatsApp shortly.', 'success');

    // Close modal and reset form
    closeAppointmentModal();
    e.target.reset();

    console.log('Appointment form submission:', formEntries);
}

function generateWhatsAppMessage(formData) {
    const entries = Object.entries(formData);
    let message = '🏛️ *JurisEdge Law Firm - Appointment Request*\n\n';

    const fieldLabels = {
        0: '👤 Name',
        1: '📱 Phone',
        2: '📧 Email',
        3: '📅 Date',
        4: '⏰ Time',
        5: '💼 Type',
        6: '⚖️ Legal Matter',
        7: '📝 Description'
    };

    entries.forEach(([key, value], index) => {
        if (value && value.trim()) {
            const label = fieldLabels[index] || key;
            message += `${label}: ${value}\n`;
        }
    });

    message += '\n📞 Please confirm this appointment. Thank you!';
    return message;
}

function setupPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }

            e.target.value = value;
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 350px;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    });
}

// Setup animations
function setupAnimations() {
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .service-card,
        .team-member,
        .testimonial-card,
        .contact-method {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }

        .mobile-active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 2rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }

        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
            box-shadow: 0 2px 30px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollButton = document.createElement('div');
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #1a294a;
        color: white;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(26, 41, 74, 0.3);
    `;

    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
}

// Initialize scroll to top button
setTimeout(addScrollToTopButton, 1000);

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization - lazy load images if any are added later
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Call lazy loading setup
setupLazyLoading();

// Error handling for forms
window.addEventListener('error', function(e) {
    console.log('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Analytics tracking (placeholder for Google Analytics or other services)
function trackEvent(eventName, parameters = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, parameters);

    // Example implementation for Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, parameters);
    // }
}

// Track important user interactions
document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button');
    if (target) {
        const eventName = target.textContent.trim().toLowerCase();
        if (eventName.includes('call') || eventName.includes('phone')) {
            trackEvent('phone_click', { button_text: target.textContent.trim() });
        } else if (eventName.includes('whatsapp')) {
            trackEvent('whatsapp_click', { button_text: target.textContent.trim() });
        } else if (eventName.includes('appointment') || eventName.includes('book')) {
            trackEvent('appointment_click', { button_text: target.textContent.trim() });
        }
    }
});

// Update current year in footer
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
}

// Animated Statistics Counter
function setupStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateStats = () => {
        if (hasAnimated) return;

        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.hasAttribute('data-decimal');
            const duration = 2000; // 2 seconds
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                if (isDecimal) {
                    const current = (target * easeOutCubic).toFixed(1);
                    stat.textContent = current;
                } else {
                    const current = Math.floor(target * easeOutCubic);
                    stat.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });

        hasAnimated = true;
    };

    // Create intersection observer to trigger animation when hero stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for dramatic effect
                setTimeout(animateStats, 500);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}


console.log('JurisEdge Law Firm website initialized successfully!');