var buttons = document.getElementsByClassName("trivia-btn");
var question = document.getElementById("trivia-question");
var correct = document.getElementById("trivia-ok");
var fail = document.getElementById("trivia-fail");
var closebtn = document.getElementsByClassName("close-btn")[0];

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", checkResponse);
}

closebtn.addEventListener("click", function() {
    document.getElementById("trivia").classList.remove("popup-visible");
});

function checkResponse(event) {
    if (event.target.value === 'true') {
        correct.classList.add("visible");
    } else {
        fail.classList.add("visible");
    }
    setTimeout(function() {
        correct.classList.remove("visible");
        fail.classList.remove("visible");
    }, 600)
}

function loadQuestion() {
    question.innerText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, laudantium dicta eveniet sit veritatis unde! Voluptatem, rerum temporibus quod laudantium accusamus praesentium expedita ipsum beatae molestias aut laboriosam quae, amet?";
}

window.addEventListener("load", function(event) {
    loadQuestion();
})