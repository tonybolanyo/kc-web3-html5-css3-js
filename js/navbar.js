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
    // after load all elements, attach click event
    // to every menu item, including logo

    logo = document.getElementById("logo");
    menuItems = document.getElementsByClassName("navbar-list-item");

    for (i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", scrollToSection);
    }

    // home is a special case because we use logo to navitate to top
    logo.addEventListener("click", scrollToSection)
});

function scrollToSection(event) {
    event.preventDefault();

    var destUri = event.target.hash;
    var sectionId, destSection;

    if (destUri === '') {
        destSection = header;
    } else {
        sectionId = destUri.substr(1);
        destSection = document.getElementById(sectionId);
    }

    /* fix the top position with the navbar height,
       using 2px to fix round calculations */
    var navbarHeight = Math.round(navbar.getBoundingClientRect().height)-2;
    offset = Math.round(destSection.getBoundingClientRect().top) - navbarHeight;

    smoothScroll(offset);
}

function smoothScroll(offset) {
    // recursive scroll every 25% of the offset
    var fromPos = Math.round(window.pageYOffset);
    var step = Math.round(offset / 4);
    var toPos = fromPos + step;
    console.log(fromPos, toPos)
    if (fromPos == toPos) {
        // end condition
        return
    }

    window.scrollTo(0, toPos);
    setTimeout(smoothScroll, 30, offset - step);

}