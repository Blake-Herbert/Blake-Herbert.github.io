// Toggle Hamburger menu display on click
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const headerLinks = document.querySelector('.header-links');

    hamburgerMenu.addEventListener('click', function () {
        headerLinks.classList.toggle('show');
    });
});