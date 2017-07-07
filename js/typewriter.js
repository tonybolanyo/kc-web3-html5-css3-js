function writeChar(elem, text) {
    // add char to the end of the element content
    elem.innerHTML += text[0];
    if (text.length > 1) {
        setTimeout(writeChar, 125, elem, text.slice(1, text.length));
    }
}

function typeEffect() {
    var lines = document.getElementsByClassName("typewriter");
    var start_time = 1000;      // delay to start
    var pause_end_line = 800;   // make a pause at end of line
    var char_time = 125;        // pause between characters

    for (i = 0; i < lines.length; i++) {
        var content = lines[i].innerHTML;
        lines[i].innerHTML = '';
        setTimeout(writeChar, start_time, lines[i], content);
        start_time += char_time * content.length + pause_end_line;
    }
}

window.onload = typeEffect;
