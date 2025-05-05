const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");
const msgField = document.getElementById("msgField");
const submitBtn = document.getElementById("submitBtn");
const popupContainer = document.getElementById("popupContainer");
const form = document.getElementById("form");


// Form event listener
formBtn();
function formBtn(){
    submitBtn.addEventListener("click", function(event){
        
        event.preventDefault();
        readForm();
        console.log("BTN clicked");
    })
}

function readForm(){
    let userName = nameField.value;
    let email = emailField.value;
    let message = msgField.value;

    if(!userName||!email||!message){
        alert("Please, fill all the fields.")
        return;
    }

    if(!email.includes("@")){
        alert("Please, enter a valid email address.")
        return;
    }

    let userInfo = {
        name: userName,
        mail: email,
        msg: message
    }

    createPopup(userInfo);
}
//Pop-up style

function createPopup(info){
    popupContainer.innerHTML = `

    <div id="popUp">
    <img src = "icons/confirmation_icon.png">
    <p>Hello, <strong>${info.name}!</strong></p>
    <p>Your message has been sent:</p>
    <p><i>"${info.msg}"</i></p>
    <p>We will keep in touch through:</p>
    <p><strong>${info.mail}</strong></p>
    <h4>Thanks for your feedback!</h4>
    <button id="closeBtn">Close</button>
    </div>
    `;
    closeBton();
}

function closeBton(){
    const closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", function(){
        clearContent();
    });
}
closeBton();
function clearContent(){
    popupContainer.innerHTML = "";
    nameField.value = "";
    emailField.value = "";
    msgField.value = "";
}