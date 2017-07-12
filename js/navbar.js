/* sticky navbar */

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

    var logo = document.getElementById("logo");
    var menuItems = document.getElementsByClassName("navbar-list-item");

    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", scrollToSection);
    }

    // home is a special case because we use logo to navitate to top
    logo.addEventListener("click", scrollToSection)
});

function scrollToSection(event) {
    // moves to a section when link in navbar is clicked

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
    var offset = Math.round(destSection.getBoundingClientRect().top) - navbarHeight;

    // call smooth scroll insted
    smoothScroll(offset);
}

function smoothScroll(offset) {
    // recursive scroll every 25% of the offset
    var fromPos = Math.round(window.pageYOffset);
    var step = Math.round(offset / 4);
    var toPos = fromPos + step;
    
    if (fromPos == toPos) {
        // end condition
        return
    }

    // make the scroll and call the function
    // recursively with the rest of the distance.
    // Apply a delay to make the effect.
    window.scrollTo(0, toPos);
    setTimeout(smoothScroll, 30, offset - step);

}

/* scroll spy to activate current section navbar item */

var sections = document.getElementsByTagName("section");
var currentSection = null;

function isSectionVisible(section) {
    // returns `true` if a section is considered visible (also active).
    var rect = section.getBoundingClientRect();
    var vpHeight = window.innerHeight;

    // Return false if it's not in the viewport
    if (rect.bottom < 0 || rect.top > vpHeight)
        return false;

    // Return true if top is in the top half of the viewport
    // or top half of viewport is "inside" section bounds
    return (
        rect.top > 0 && rect.top < navbar.getBoundingClientRect().height ||
        rect.top < 0 && rect.bottom > navbar.getBoundingClientRect().height
    );
}

function changeActiveNav(active) {
    // add class `active` to active section (passed as param) and
    // remove it from the others
    var navs = document.getElementsByClassName("navbar-list-item");
    for (var i = 0; i < navs.length; i++) {
        if (navs[i] === active) {
            navs[i].classList.add("active");
        } else {
            navs[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", function() {
    // We already have a function listen to scroll event
    // but make another one for clarity

    var anyVisible = false;

    for (var i = 0; i < sections.length; i++) {
        var sectionId = sections[i].id;
        var selector = "a[href$='" + sectionId + "']";
        if (isSectionVisible(sections[i])) {
            if (!currentSection || currentSection != sectionId) {
                // only apply classes if current section changes
                // not every scroll event inside a section.
                var link = document.querySelector(selector);
                var navItem = link.parentNode;
                currentSection = sectionId;
                changeActiveNav(navItem);
            }
            anyVisible = true;
        }
    }

    if (!anyVisible) {
        // handle when user can see cover, not a content section
        currentSection = null;
        changeActiveNav(null);
    }
});