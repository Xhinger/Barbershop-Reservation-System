
const serviceCatalog = {
    "Classic Haircut": { price: 150 },
    "Fade": { price: 150 },
    "Low Fade": { price: 150 },
    "Mid Fade": { price: 150 },
    "High Fade": { price: 150 },
    "Burst Fade": { price: 150 },
    "Mullet": { price: 150 },
    "Semi-Kalbo": { price: 150 }
};

const barbers = ["Mia Jose Silva", "Leo Ramos Cruz", "Ian Dizon"];
const form = document.getElementById("booking-form");
const serviceSelect = document.getElementById("service");
const summaryMessage = document.getElementById("summary-message");
const summaryDetails = document.getElementById("summary-details");
const barberDisplay = document.getElementById("barber-selection");
const barberName = document.getElementById("selected-barber");
const requestedBarber = new URLSearchParams(window.location.search).get("barber");
const selectedBarber = barbers.includes(requestedBarber) ? requestedBarber : "";

if (selectedBarber) {
    barberName.textContent = selectedBarber;
    barberDisplay.hidden = false;
}

function updateReservationSummary() {
    const selectedService = serviceSelect.value;
    const details = serviceCatalog[selectedService];

    if (!selectedService || !details) {
        summaryMessage.hidden = false;
        summaryDetails.hidden = true;
        return null;
    }

    document.getElementById("summary-service").textContent = selectedService;
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
        barber: selectedBarber,
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