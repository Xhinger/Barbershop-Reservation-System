const reservation = JSON.parse(
    localStorage.getItem("reservation")
);

if (reservation) {

    document.getElementById("display-name").textContent =
        reservation.name;

    document.getElementById("display-contact").textContent =
        reservation.contact;

    document.getElementById("display-service").textContent =
        reservation.service;

    document.getElementById("display-date").textContent =
        reservation.date;

    document.getElementById("display-time").textContent =
        reservation.time;

    document.getElementById("display-message").textContent =
        reservation.message || "None";

}