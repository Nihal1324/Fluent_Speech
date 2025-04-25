const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
  // JavaScript to open and close the "Forgot Password" modal

const forgotPasswordLink = document.getElementById("forgot-password-link");
const modal = document.getElementById("forgot-password-modal");
const closeModal = document.getElementById("close-modal");
const resetBtn = modal.querySelector("button");
const emailInput = modal.querySelector('input[type="email"]');
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault(); // extra safety
    console.log("forget pasword clicked!")
    modal.classList.add("show");
});

// Hide modal on close button
closeModal.addEventListener("click", function () {
    modal.classList.remove("show");
});

// Hide modal when clicking outside
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.classList.remove("show");
    }
});
resetBtn.onclick = () => {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        alert("⚠️ Please enter your email address.");
    } else if (!emailRegex.test(email)) {
        alert("❌ Invalid email format.");
    } else {
        alert("✅ Password reset link sent to your email!");
        modal.style.display = "none";
        emailInput.value = ""; // Reset input
    }
};

