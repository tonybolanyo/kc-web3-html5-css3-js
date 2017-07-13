var buttons = document.getElementsByClassName("trivia-btn");
var question = document.getElementById("trivia-question");
var correct = document.getElementById("trivia-ok");
var fail = document.getElementById("trivia-fail");
var closebtn = document.getElementsByClassName("close-btn")[0];
var sessionToken = null;
var currentQuestion = null;
var endpoint = "https://opentdb.com/api.php?amount=1&category=18&difficulty=medium&type=boolean";

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", checkResponse);
}

closebtn.addEventListener("click", function() {
    document.getElementById("trivia").classList.remove("popup-visible");
});

function checkResponse(event) {
    console.log(event.target.value.toLowerCase(), currentQuestion.correct_answer.toLowerCase());
    if (event.target.value.toLowerCase() === currentQuestion.correct_answer.toLowerCase()) {
        correct.classList.add("visible");
    } else {
        fail.classList.add("visible");
    }
    loadQuestion();
    setTimeout(function() {
        correct.classList.remove("visible");
        fail.classList.remove("visible");
    }, 600)
}

function loadQuestion() {
    console.log("Loading question");
    var	xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                currentQuestion = jsonResponse.results[0];
                question.innerHTML = currentQuestion.question;
            } else {
                console.error("Error getting a new question", xhr.status);
            }
        }
    }
    xhr.send();
}

window.addEventListener("load", function(event) {
    loadQuestion();
})