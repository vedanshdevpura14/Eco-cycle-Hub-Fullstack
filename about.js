// DOM Elements
const animateElements = document.querySelectorAll('[data-animate]');

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add animate class to elements with data-animate attribute
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        observer.observe(element);
    });
});