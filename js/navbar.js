var header = document.getElementById('header');
var navbar = document.getElementById('navbar');
var backTop = document.getElementById('back-top');

// we stick navbar when reaches top of screen
// as navbar is "inside" height of cover
// we need to substract its height to header height
var limit = header.getBoundingClientRect().height - navbar.getBoundingClientRect().height;

window.addEventListener("scroll", function() {
    var scrollY = window.pageYOffset;
    // when scrolling is beyond top of navbar
    // add a class to make it sticky
    // if not, remove that class
    if (scrollY > limit) {
        navbar.classList.add("fixed-navbar");
        backTop.classList.add("visible");
    } else {
        navbar.classList.remove("fixed-navbar");
        backTop.classList.remove("visible");
    }
});

window.addEventListener("resize", function() {
    // Recalculate limit if window resize
    limit = header.getBoundingClientRect().height - navbar.getBoundingClientRect().height;
});


/* smooth scroll */

window.addEventListener("load", function() {
    menuItems = document.getElementsByClassName("navbar-list-item");

    for (i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", scrollToSection);
    }
});

function smoothScroll(offset) {
    console.log(offset);
    var newOffset = offset * offset * (3 - offset * 4);
    window.scrollBy(0, offset - newOffset);
    if (newOffset > 0) {
        setTimeout(smoothScroll, 100, newOffset);
    }
}

function scrollToSection(event) {
    event.preventDefault();

    var destUri = event.target.href;
    var sectionId = destUri.split("#")[1];
    var destSection = document.getElementById(sectionId);
    var destPosition = destSection.getBoundingClientRect();
    console.log(destPosition.top);
    smoothScroll(destPosition.top);
}