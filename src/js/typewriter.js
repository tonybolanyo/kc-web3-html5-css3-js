var char_time = 150;        // pause between characters

function showCursor(elem) {
    // Remove class has-cursor from all elements
    // and add it only to element `elem`
    var candidates = document.getElementsByClassName("has-cursor");
    for (i = 0; i < candidates.length; i++) {
        candidates[i].classList.remove("has-cursor");
    }
    elem.classList.add("has-cursor");
}

function writeChar(elem, text, cursor) {
    // add first char of text to the end of the element content
    // use recursively, we add all text char by char
    // if cursor is true, then add `has-cursor` class to elem
    // through `showCursor` function
    if (cursor) {
        showCursor(elem);
    }
    elem.innerHTML += text[0];
    if (text.length > 1) {
        setTimeout(writeChar, 125, elem, text.slice(1, text.length), false);
    }
}

function typeEffect() {
    // starts the typewriter effect on all lines with
    // `typewriter` class.
    // The delay is calculated to show line by line.
    var lines = document.getElementsByClassName("typewriter");
    var start_time = 1500;      // delay to start
    var pause_end_line = 900;   // make a pause at end of line
    var container = document.getElementsByClassName('typewriter-container')[0];

    for (i = 0; i < lines.length; i++) {
        var content = lines[i].innerHTML;
        lines[i].innerHTML = '';
        setTimeout(writeChar, start_time, lines[i], content, true);
        start_time += char_time * content.length + pause_end_line;
    }

    container.style.visibility = 'visible';
}

window.addEventListener("load", typeEffect);
