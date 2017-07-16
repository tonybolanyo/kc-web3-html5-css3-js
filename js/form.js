var body = document.getElementsByTagName("body")[0];
var form = document.getElementById("contact-form");
var vFields = {
    name: {
        element: document.getElementById("name"),
        message: "Please fill this field with your name"
    },
    email: {
        element: document.getElementById("email"),
        message: "Email can't be empty and must be a valid address"
    },
    phone: {
        element: document.getElementById("phone"),
        message: "Phone must contain only numbers and must be between 6 and 12 length"
    },
    knownby: {
        element: document.getElementById("knownby1"),
        message: "Select one option, please"
    },
    knownby4: {
        element: document.getElementById("knownby4"),
        message: ""
    },
    knownbyother: {
        element: document.getElementById("knownbyother"),
        message: "Please write an origin"
    },
    comments: {
        element: document.getElementById("comments"),
        message: "No more than 150 words are allowed"
    }
};

var submitBtn = document.getElementById("submit");
var loadingIcon = document.createElement('span');
loadingIcon.classList.add("icon-spinner-arrow", "icon-spin");

var markErrorField = function(inputElem, message) {
    var group = inputElem.parentElement;
    var icon = document.createElement("span");
    icon.classList.add("icon-warning");
    icon.classList.add("icon-validation");
    group.appendChild(icon);
    var msg = document.createElement("div");
    msg.classList.add("form-error-text");
    msg.innerText = message;
    group.appendChild(msg);
    inputElem.classList.add("invalid");
}

var removeErrorMark = function(inputElem) {
    var group = inputElem.parentElement;
    var icon = group.querySelector(".icon-warning");
    var error = group.querySelector(".form-error-text");
    // error elements are the last two of the group
    if (icon) {
        group.removeChild(icon);
    }
    if (error) {
        group.removeChild(error);
    }
    inputElem.classList.remove("invalid");
}

/* Validate all fields before submit the form */
form.addEventListener("submit", function(event) {
    event.preventDefault();
    var firstError = null;
    for (var key in vFields) {
        removeErrorMark(vFields[key].element);
        if (vFields[key].element.checkValidity() === false) {
            markErrorField(vFields[key].element, vFields[key].message);
            if (!firstError) {
                firstError = vFields[key].element;
            }
        }
    }

    // Validate if known by other is selected
    if (vFields["knownby4"].element.checked && !vFields["knownbyother"].element.value) {
        markErrorField(vFields["knownbyother"].element, vFields["knownbyother"].message);
        if (!firstError) {
            firstError = vFields["knownbyother"].element;
        }
    }

    // Validate max words allowed in comments
    if (!checkWords(vFields["comments"].element)) {
        markErrorField(vFields["comments"].element, vFields["comments"].message);
        if (!firstError) {
            firstError = vFields["comments"].element;
        }
    }

    if (firstError) {
        // then we move focus to field with error
        firstError.focus();
    } else {
        submitBtn.setAttribute("disabled", "");
        submitBtn.appendChild(loadingIcon);
        setTimeout(function () {
            submitBtn.removeAttribute("disabled");
            submitBtn.removeChild(loadingIcon);
            sendForm();
            form.reset();
        }, 1000)
    }

});

/* Validate field when lost focus */
for (var key in vFields) {
    vFields[key].element.addEventListener("blur", function(event) {
        console.log(this);
        console.log(event.target.id)
        var elem = event.target;
        var msg = vFields[elem.id].message;
        removeErrorMark(elem);
        if (elem.checkValidity() === false) {
            markErrorField(elem, msg);
        }
    });
}


/* No send anything when submitting form
   we use a kind of popup ;) */
var sendForm = function() {
    var resultsDiv = document.createElement("div");
    resultsDiv.classList.add("popup-section");
    var table = document.createElement("table");
    resultsDiv.appendChild(table);
    var fields = form.elements;
    for (var i=0; i<fields.length; i++){
        var item = fields[i];
        console.log(item.type);
        if (item.type === "submit" ||
            item.type === "radio" && !item.checked ||
            item.value === "undefined") {
            continue;
        }
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var th = document.createElement("th");
        th.innerText = item.name + ":";
        tr.appendChild(th);
        var td = document.createElement("td");
        td.innerText = item.value;
        tr.appendChild(td);
    }
    var closeBtn = document.createElement("button");
    closeBtn.classList.add("close-button");
    closeBtn.innerText = "OK";
    closeBtn.addEventListener("click", function(event) { body.removeChild(resultsDiv); });
    resultsDiv.appendChild(closeBtn);
    body.appendChild(resultsDiv);
    resultsDiv.classList.add("popup-visible");
}

/* For validate max words allowed on textarea */
var checkWords = function (textarea) {
    // returns true if num words is less than max words allowed
    // false otherwise
    var maxWords = 150;
    var words = textarea.value.split(/[\s]+/); /* split if one or more spaces */
    if(words.length > maxWords) {
        return false;
    }
    return true;
}