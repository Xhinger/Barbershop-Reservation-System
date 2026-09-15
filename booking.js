
const serviceCatalog = {
    "Classic Haircut": { barber: "James", price: 150 },
    Fade: { barber: "James", price: 150 },
    "Low Fade": { barber: "James", price: 150 },
    "Mid Fade": { barber: "James", price: 150 },
    "High Fade": { barber: "James", price: 150 },
    "Burst Fade": { barber: "James", price: 150 },
    Mullet: { barber: "James", price: 150 },
    "Semi-Kalbo": { barber: "James", price: 150 }
};

const form = document.getElementById("booking-form");
const serviceSelect = document.getElementById("service");
const summaryMessage = document.getElementById("summary-message");
const summaryDetails = document.getElementById("summary-details");

function updateReservationSummary() {
    const selectedService = serviceSelect.value;
    const details = serviceCatalog[selectedService];

    if (!selectedService || !details) {
        summaryMessage.hidden = false;
        summaryDetails.hidden = true;
        return null;
    }

    document.getElementById("summary-service").textContent = selectedService;
    document.getElementById("summary-barber").textContent = details.barber;
    document.getElementById("summary-price").textContent = `₱${details.price}`;
    summaryMessage.hidden = true;
    summaryDetails.hidden = false;

    return details;
}

const requestedService = new URLSearchParams(window.location.search).get("service");
if (requestedService && serviceCatalog[requestedService]) {
    serviceSelect.value = requestedService;
}

serviceSelect.addEventListener("change", updateReservationSummary);
updateReservationSummary();

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const serviceDetails = updateReservationSummary();
    if (!serviceDetails) {
        serviceSelect.focus();
        return;
    }

    const reservation = {
        service: serviceSelect.value,
        barber: serviceDetails.barber,
        price: serviceDetails.price,
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