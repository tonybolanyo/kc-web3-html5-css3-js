var buttons = document.getElementsByClassName("trivia-btn");
var question = document.getElementById("trivia-question");
var correct = document.getElementById("trivia-ok");
var fail = document.getElementById("trivia-fail");
var closebtn = document.getElementsByClassName("close-btn")[0];
var sessionToken = null;
var currentQuestion = null;
var questionsEndpoint = "https://opentdb.com/api.php";
var tokenEndpoint = "https://opentdb.com/api_token.php";

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
    console.log("Loading question", sessionToken);
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
                console.log(jsonResponse);
            } else {
                console.error("Error getting a new question", xhr.status);
            }
        }
    }
    xhr.send();
}

var getSessionToken = function () {
    var uri = tokenEndpoint + "?command=request"
    console.log("getting new session token");
    var	xhr = new XMLHttpRequest();

    xhr.open("GET", uri, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.response_code === 0) {
                    sessionToken = jsonResponse.token;
                }
                console.log("resp", jsonResponse);
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