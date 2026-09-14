
const form = document.getElementById("booking-form");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const reservation = {
        service: document.getElementById("service").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        name: document.getElementById("name").value,
        contact: document.getElementById("contact").value,
        message: document.getElementById("message").value
    };

    // Save reservation
    localStorage.setItem("reservation", JSON.stringify(reservation));

    // Go to reservation details page
    window.location.href = "display_info.html";
});