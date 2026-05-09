const navLinks = document.querySelector('.nav-links');
const navHamburger = document.querySelector('.nav-hamburger');

navHamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    navHamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
    navLinks.classList.remove('nav-open');
    navHamburger.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', (e) => {
    if (!navHamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('nav-open');
    navHamburger.setAttribute('aria-expanded', false);
    }
});