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
    knownbyother: {
        element: document.getElementById("knownbyother"),
        message: "Please write one origin or select an element from the list"
    }
};

var submitBtn = document.getElementById("submit");
var loadingIcon = document.createElement('span');
loadingIcon.classList.add("icon-spinner-arrow", "icon-spin");

var markErrorField = function(inputElem, message) {
    var group = inputElem.parentElement;
    var htmlErrorIcon = '<span class="icon-warning icon-validation"></span>';
    var icon = document.createElement("span");
    icon.classList.add("icon-warning", "icon-validation");
    group.append(icon);
    var msg = document.createElement("div");
    msg.classList.add("form-error-text");
    msg.innerText = message;
    group.append(msg);
    inputElem.classList.add("invalid");
}

var removeErrorMark = function(inputElem) {
    var group = inputElem.parentElement;
    var icon = group.querySelector(".icon-warning");
    var error = group.querySelector(".form-error-text");
    // error elements are the last two of the group
    if (icon) {
        console.log(icon);
        icon.remove();
    }
    if (error) {
        console.log(error);
        error.remove();
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
    if (firstError) {
        // then we move focus to field with error
        firstError.focus();
    } else {
        submitBtn.setAttribute("disabled", "");
        submitBtn.appendChild(loadingIcon);
        setTimeout(function () {
            submitBtn.removeAttribute("disabled");
            submitBtn.removeChild(loadingIcon);
            sendNotification(
                "New message from " + vFields["name"].element.value,
                form.querySelector("textarea").value
            );
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
   we use notifications API as backend ;) */
function sendNotification (msg, body) { 
    var notification = Notification || mozNotification || webkitNotification;

    if (body) {
        var options = {
            body: body
        };
    }

    if (typeof notification === 'undefined') {
        alert("Notificaciones no soportadas");
    } else {
        notification.requestPermission(function (permission) {
            if (Notification.permission === 'granted') {
                new Notification(msg, options);
            }
        });
    }
}