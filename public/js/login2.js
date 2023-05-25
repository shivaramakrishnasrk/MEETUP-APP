const loginForm = $("#myForm2");
const emailInput = $("#email");
const passwordInput = $("#password");
let errorDiv = $("#error");
let emailErrorDiv = $("#emailError");
let passwordErrorDiv = $("#password-error");

function checkEmail(email, varName) {
  if (typeof email !== "string") {
    throw `${varName} must be a string`;
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw `The ${varName} must be a valid email address`;
  }
}

function checkPassword(password, varName) {
  if (typeof password !== "string") {
    throw `${varName} must be of string type`;
  }

  if (password.length < 8) {
    throw "Password must be at least 8 characters long";
  }
  if (!/[a-z]/.test(password)) {
    throw "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    throw "Password must contain at least one uppercase letter";
  }
  if (!/\d/.test(password)) {
    throw "Password must contain at least one number";
  }
}

emailInput.on("input", () => {
  const email = emailInput.val().trim().toLowerCase();

  if (email === "") {
    $("#email-status").html("");
    emailErrorDiv.text("");
    emailInput.get(0).setCustomValidity("");
  } else {
    try {
      checkEmail(email, "Email");
      emailErrorDiv.text("");
      emailInput.get(0).setCustomValidity("");

      $.ajax({
        url: "/validate-email",
        method: "POST",
        data: JSON.stringify({ email }),
        contentType: "application/json",
        dataType: "json",
      })
        .done((data) => {
          if (!data.exists) {
            $("#email-status").html(
              '<i class="fa-sharp fa-solid fa-circle-xmark" style="color: red;"></i>'
            );
            emailErrorDiv.text("This email does not exist in our database");
            emailInput
              .get(0)
              .setCustomValidity("This email does not exist in our database");
          } else {
            $("#email-status").html(
              '<i class="fa-solid fa-check" style="color: green;"></i>'
            );
            emailErrorDiv.text("");
            emailInput.get(0).setCustomValidity("");
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(errorThrown);
        });
    } catch (error) {
      $("#email-status").html(
        '<i class="fa-sharp fa-solid fa-circle-xmark" style="color: red;"></i>'
      );
      emailErrorDiv.text(error);
      emailInput.get(0).setCustomValidity(error);
    }
  }
});



passwordInput.on("input", () => {
  try {
    checkPassword(passwordInput.val().trim(), "Password");
    passwordErrorDiv.text("");
    passwordInput.get(0).setCustomValidity("");
  } catch (error) {
    passwordErrorDiv.text(error);
    passwordInput.get(0).setCustomValidity(error);
  }
});


loginForm.on("submit", (event) => {
  
   if (!emailInput.val() || !passwordInput.val()) {
      event.preventDefault();
      errorDiv.prop("hidden", false);
      errorDiv.html("Inputs must be entered");
      return;
    }


  if (emailInput.val().trim() === '') {
    emailErrorDiv.text("Please enter emailId");
    emailInput.get(0).setCustomValidity("");
    emailInput.focus();
    return;
  }

  if (passwordInput.val().trim() === '') {
    passwordErrorDiv.text("Please enter password");
    passwordInput.get(0).setCustomValidity("");
    passwordInput.focus();
    return;
  }

  if (!loginForm.get(0).checkValidity()) {
    errorDiv.prop("hidden", false);
    errorDiv.html("Please correct the errors above");
    return;
  }

});