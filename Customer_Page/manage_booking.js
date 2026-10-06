const API_BASE = "https://barbershop-reservation-system.onrender.com/api/appointments";

const statusMessage = document.getElementById("status-message");
const statusBadge = document.getElementById("booking-status");
const customerName = document.getElementById("customer-name");
const serviceName = document.getElementById("service-name");
const bookingDate = document.getElementById("booking-date");
const bookingTime = document.getElementById("booking-time");
const barberName = document.getElementById("barber-name");
const contactDetails = document.getElementById("contact-details");
const bookingMessage = document.getElementById("booking-message");

const changeTimeBtn = document.getElementById("change-time-btn");
const cancelBookingBtn = document.getElementById("cancel-booking-btn");
const actionPanel = document.getElementById("action-panel");
const cancelledMessage = document.getElementById("cancelled-message");
const changeTimeSection = document.getElementById("change-time-section");
const cancelConfirmation = document.getElementById("cancel-confirmation");
const changeTimeForm = document.getElementById("change-time-form");
const editService = document.getElementById("edit-service");
const editDate = document.getElementById("edit-date");
const editTime = document.getElementById("edit-time");

let currentAppointment = null;

function showMessage(text, type = "success") {
    statusMessage.textContent = text;
    statusMessage.className = "status-message show " + type;
}

function hideMessage() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}

function setStatusBadge(label) {
    statusBadge.textContent = label;
    statusBadge.classList.toggle("cancelled", label && label.toLowerCase() === "cancelled");
}

function formatCancelledDate(dateValue) {
    if (!dateValue) {
        return "today";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return "today";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function renderAppointment(appointment) {
    currentAppointment = appointment;

    customerName.textContent = appointment.customerName || "Unknown customer";
    serviceName.textContent = appointment.service || "-";
    bookingDate.textContent = appointment.date || "-";
    bookingTime.textContent = appointment.time || "-";
    barberName.textContent = appointment.barber || "Not assigned";
    contactDetails.textContent = appointment.contactNumber || "-";
    bookingMessage.textContent = appointment.message || "None";

    const status = appointment.status || "Pending";
    setStatusBadge(status);

    if (status.toLowerCase() === "cancelled") {
        actionPanel.style.display = "none";
        changeTimeSection.classList.add("hidden");
        cancelConfirmation.classList.add("hidden");

        const cancelledAt = appointment.cancelledAt || appointment.updatedAt || new Date();
        cancelledMessage.textContent = `This appointment was cancelled on ${formatCancelledDate(cancelledAt)}. You are welcome to book again any time.`;
        cancelledMessage.classList.add("show");

        changeTimeBtn.disabled = true;
        cancelBookingBtn.disabled = true;
    } else {
        actionPanel.style.display = "grid";
        cancelledMessage.classList.remove("show");
        cancelledMessage.textContent = "";
        changeTimeBtn.disabled = false;
        cancelBookingBtn.disabled = false;
    }

    editService.value = appointment.service || "";
    editDate.value = appointment.date || "";
    editTime.value = appointment.time || "";

    localStorage.setItem("reservation", JSON.stringify(appointment));
}

function togglePanel(panel) {
    const isHidden = panel.classList.contains("hidden");

    if (panel === changeTimeSection) {
        changeTimeSection.classList.toggle("hidden", !isHidden);
        cancelConfirmation.classList.add("hidden");
    }

    if (panel === cancelConfirmation) {
        cancelConfirmation.classList.toggle("hidden", !isHidden);
        changeTimeSection.classList.add("hidden");
    }
}

function getAppointmentId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || localStorage.getItem("lastBookingId");
}

async function fetchAppointment() {
    const appointmentId = getAppointmentId();

    if (!appointmentId) {
        const fallbackReservation = JSON.parse(localStorage.getItem("reservation") || "null");

        if (fallbackReservation) {
            renderAppointment(fallbackReservation);
            return;
        }

        showMessage("No booking was found to manage.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${appointmentId}`);

        if (!response.ok) {
            throw new Error("Appointment not found");
        }

        const data = await response.json();
        renderAppointment(data);
    } catch (error) {
        const fallbackReservation = JSON.parse(localStorage.getItem("reservation") || "null");

        if (fallbackReservation) {
            renderAppointment(fallbackReservation);
            return;
        }

        showMessage("Unable to load this booking right now.", "error");
    }
}

async function saveAppointment(updatePayload) {
    const appointmentId = getAppointmentId();
    const localUpdatedAppointment = {
        ...currentAppointment,
        ...updatePayload,
        status: updatePayload.status || (currentAppointment && currentAppointment.status) || "Pending",
        cancelledAt: updatePayload.cancelledAt || (currentAppointment && currentAppointment.cancelledAt) || null
    };

    localStorage.setItem("reservation", JSON.stringify(localUpdatedAppointment));

    if (appointmentId) {
        localStorage.setItem("lastBookingId", appointmentId);
    }

    renderAppointment(localUpdatedAppointment);
    hideMessage();

    if (!appointmentId) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${appointmentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(localUpdatedAppointment)
        });

        if (!response.ok) {
            throw new Error("Unable to update appointment");
        }

        const updatedAppointment = await response.json();
        localStorage.setItem("reservation", JSON.stringify(updatedAppointment));
        localStorage.setItem("lastBookingId", updatedAppointment._id || appointmentId);
        renderAppointment(updatedAppointment);
    } catch (error) {
        showMessage(error.message || "Something went wrong while updating this appointment.", "error");
    }
}

changeTimeBtn.addEventListener("click", () => {
    changeTimeSection.classList.remove("hidden");
    cancelConfirmation.classList.add("hidden");
});

cancelBookingBtn.addEventListener("click", () => {
    cancelConfirmation.classList.remove("hidden");
    changeTimeSection.classList.add("hidden");
});

document.getElementById("cancel-edit-btn").addEventListener("click", () => {
    changeTimeSection.classList.add("hidden");
});

document.getElementById("keep-booking-btn").addEventListener("click", () => {
    cancelConfirmation.classList.add("hidden");
});

changeTimeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentAppointment) {
        showMessage("There is no active booking to update.", "error");
        return;
    }

    const payload = {
        ...currentAppointment,
        service: editService.value,
        date: editDate.value,
        time: editTime.value,
        status: currentAppointment.status || "Pending"
    };

    await saveAppointment(payload);
    showMessage("Appointment updated successfully.", "success");
    changeTimeSection.classList.add("hidden");
});

document.getElementById("confirm-cancel-btn").addEventListener("click", async () => {
    if (!currentAppointment) {
        showMessage("There is no active booking to cancel.", "error");
        return;
    }

    const payload = {
        ...currentAppointment,
        status: "Cancelled",
        cancelledAt: new Date().toISOString()
    };

    cancelConfirmation.classList.add("hidden");
    await saveAppointment(payload);
    showMessage("Appointment cancelled successfully.", "success");
});

function setDateMin() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    editDate.min = today.toISOString().slice(0, 10);
}

setDateMin();
fetchAppointment();
