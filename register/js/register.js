"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const messageP = document.getElementById("messageP");

    registerForm.onsubmit = function (event) {
        event.preventDefault();

        const fullname = registerForm.registrationFullname.value;
        const username = registerForm.registrationUsername.value;
        const password = registerForm.registrationPassword.value;
        const confirmPassword = registerForm.registrationConfirmPassword.value;

        if (password !== confirmPassword) {
            messageP.textContent = "Passwords do not match.";
            return;
        }

        const registrationData = {
            fullName: fullname,
            username: username,
            password: password
        };

        fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    messageP.textContent = data.message;
                } else {
                    messageP.textContent = "Registration successful! Redirecting to login...";
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
            })
            .catch(error => {
                console.error("Error registering user:", error);
                messageP.textContent = "An error occurred. Please try again.";
            });
    };
});