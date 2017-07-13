var buttons = document.getElementsByClassName("trivia-btn");
var question = document.getElementById("trivia-question");
var correct = document.getElementById("trivia-ok");
var fail = document.getElementById("trivia-fail");
var closebtn = document.getElementsByClassName("close-btn")[0];
var sessionToken = null;
var currentQuestion = null;
var questionsEndpoint = "https://opentdb.com/api.php";
var tokenEndpoint = "https://opentdb.com/api_token.php";
var triviaCorrectAnswered = 0;
var triviaNumQuestions = 0;

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", checkResponse);
}

closebtn.addEventListener("click", function() {
    document.getElementById("trivia").classList.remove("popup-visible");
});

function zeroPad (num) {
    // return number as string of 2 digits
    return ("0" + num).slice(-2);
}

function checkResponse(event) {
    if (event.target.value.toLowerCase() === currentQuestion.correct_answer.toLowerCase()) {
        correct.classList.add("visible");
        triviaCorrectAnswered++;
        document.getElementById("counter-ok").innerText = 
            zeroPad(triviaCorrectAnswered);
    } else {
        fail.classList.add("visible");
        document.getElementById("counter-fail").innerText = 
            zeroPad(triviaNumQuestions - triviaCorrectAnswered);
    }
    loadQuestion();
    setTimeout(function() {
        correct.classList.remove("visible");
        fail.classList.remove("visible");
    }, 600)
}

function loadQuestion() {
    var loader = document.getElementsByClassName("trivia-loading")[0];
    question.innerHTML = "Loading question";
    loader.classList.add("visible");
    if (sessionToken === null) {
        getSessionToken();
    }
    var	xhr = new XMLHttpRequest();
    var uri = questionsEndpoint + "?amount=1&category=18&type=boolean";
    if (sessionToken) {
        uri += "&token=" + sessionToken;
    }
    xhr.open("GET", uri, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                currentQuestion = jsonResponse.results[0];
                question.innerHTML = currentQuestion.question;
                triviaNumQuestions++;
                loader.classList.remove("visible");
            } else {
                console.error("Error getting a new question", xhr.status);
            }
        }
    }
    xhr.send();
}

var getSessionToken = function () {
    var uri = tokenEndpoint + "?command=request"
    var	xhr = new XMLHttpRequest();

    xhr.open("GET", uri, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.response_code === 0) {
                    sessionToken = jsonResponse.token;
                }
            } else {
                console.error("Error getting a new session token", xhr.status);
            }
        }
    }
    xhr.send();
}

window.addEventListener("load", function(event) {
    loadQuestion();
})