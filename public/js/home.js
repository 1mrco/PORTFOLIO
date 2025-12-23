"use strict";
function initHomeInteractions() {
    const profile = document.querySelector(".profile-image-wrapper");
    if (!profile)
        return;
    const handleMove = (event) => {
        const rect = profile.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateX = y * -6;
        const rotateY = x * 6;
        profile.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    };
    const reset = () => {
        profile.style.transform = "";
    };
    profile.addEventListener("mousemove", handleMove);
    profile.addEventListener("mouseleave", reset);
}
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form)
        return;
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.querySelector(".btn-loading");
    const successMessage = document.getElementById("form-success");
    const errorMessage = document.getElementById("form-error");
    // Clear error messages on input
    const inputs = [nameInput, emailInput, subjectInput, messageInput];
    inputs.forEach((input) => {
        input === null || input === void 0 ? void 0 : input.addEventListener("input", () => {
            clearFieldError(input.id);
            hideMessages();
        });
    });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Clear previous errors
        clearAllErrors();
        hideMessages();
        // Get form values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        // Validation
        let isValid = true;
        if (!name) {
            showFieldError("contact-name", "Name is required");
            isValid = false;
        }
        if (!email) {
            showFieldError("contact-email", "Email is required");
            isValid = false;
        }
        else if (!isValidEmail(email)) {
            showFieldError("contact-email", "Please enter a valid email address");
            isValid = false;
        }
        if (!subject) {
            showFieldError("contact-subject", "Subject is required");
            isValid = false;
        }
        if (!message) {
            showFieldError("contact-message", "Message is required");
            isValid = false;
        }
        if (!isValid) {
            return;
        }
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText)
                btnText.style.display = "none";
            if (btnLoading)
                btnLoading.style.display = "inline";
        }
        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                // Success
                form.reset();
                if (successMessage) {
                    successMessage.style.display = "block";
                    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
            else {
                // Error from server
                if (errorMessage) {
                    errorMessage.textContent = data.error || "Failed to send message. Please try again.";
                    errorMessage.style.display = "block";
                    errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        }
        catch (error) {
            // Network or other error
            if (errorMessage) {
                errorMessage.textContent = "Failed to send message. Please check your connection and try again.";
                errorMessage.style.display = "block";
                errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
        finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText)
                    btnText.style.display = "inline";
                if (btnLoading)
                    btnLoading.style.display = "none";
            }
        }
    });
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorId = fieldId.replace("contact-", "") + "-error";
        const errorElement = document.getElementById(errorId);
        if (field) {
            field.classList.add("input-error");
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorId = fieldId.replace("contact-", "") + "-error";
        const errorElement = document.getElementById(errorId);
        if (field) {
            field.classList.remove("input-error");
        }
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }
    function clearAllErrors() {
        inputs.forEach((input) => {
            if (input) {
                input.classList.remove("input-error");
                const errorId = input.id.replace("contact-", "") + "-error";
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = "";
                    errorElement.style.display = "none";
                }
            }
        });
    }
    function hideMessages() {
        if (successMessage)
            successMessage.style.display = "none";
        if (errorMessage)
            errorMessage.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initHomeInteractions();
    initContactForm();
});
