// Smooth scroll function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const headerActions = document.querySelector('.header-actions');
    
    if (navMenu && headerActions) {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        headerActions.style.display = headerActions.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Check if user is already logged in
function checkLoginStatus() {
    const userPlan = sessionStorage.getItem('userPlan');
    
    if (userPlan) {
        // User is logged in, update buttons
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.innerHTML = `
                <button class="btn-primary" onclick="window.location.href='dashboard_patient.html'">
                    Mon Dashboard
                </button>
            `;
        }
    }
}

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    console.log('Vitalia+ - Page d\'accueil chargée');
    
    // Check login status
    checkLoginStatus();
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.service-box, .step-card, .pricing-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add click tracking for analytics (future implementation)
    document.querySelectorAll('button, .nav-link').forEach(element => {
        element.addEventListener('click', function() {
            console.log('Element clicked:', this.textContent);
        });
    });
    
    // Logo click handler
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Add hover effect to service boxes
    const serviceBoxes = document.querySelectorAll('.service-box');
    serviceBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove previous selection
            pricingCards.forEach(c => c.classList.remove('selected'));
            // Add selection to clicked card
            this.classList.add('selected');
        });
    });
});

// FAQ Toggle (if added later)
function toggleFAQ(faqId) {
    const faqAnswer = document.getElementById(faqId);
    if (faqAnswer) {
        faqAnswer.classList.toggle('active');
    }
}

// Newsletter form (if added later)
function subscribeNewsletter(email) {
    console.log('Newsletter subscription:', email);
    alert('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
}

// Contact form handler (if added later)
function handleContactForm(event) {
    event.preventDefault();
    console.log('Contact form submitted');
    alert('Merci ! Nous vous contacterons bientôt.');
}

// Performance optimization - Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
