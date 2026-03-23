// DOM Elements
const loginOptions = document.querySelectorAll('.login-option');
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

// Handle login option clicks
loginOptions.forEach(option => {
    option.addEventListener('click', () => {
        const userType = option.querySelector('h3').textContent.toLowerCase();
        window.location.href = `login.html?user=${userType}`;
    });
});