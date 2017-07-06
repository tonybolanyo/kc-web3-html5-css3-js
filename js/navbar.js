/* get navbar element */

var header = document.getElementById('header');
var navbar = document.getElementById('navbar');

// we stick navbar when reaches top of screen
// as navbar is "inside" height of cover
// we need to substract its height to header height
var limit = header.getBoundingClientRect().height - navbar.getBoundingClientRect().height;

window.addEventListener("scroll", function() {
    var scrollY = window.scrollY;
    // when scrolling is beyond top of navbar
    // add a class to make it sticky
    // if not, remove that class
    if (scrollY > limit) {
        navbar.classList.add("fixed-navbar");
    } else {
        navbar.classList.remove("fixed-navbar");
    }
});

window.addEventListener("resize", function() {
    // Recalculate limit if window resize
    limit = header.getBoundingClientRect().height - navbar.getBoundingClientRect().height;
});