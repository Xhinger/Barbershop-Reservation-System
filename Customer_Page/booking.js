
let serviceCatalog = {};

const serviceSelect = document.getElementById("service");

fetch("http://localhost:5000/api/services")
.then(res => res.json())
.then(services => {

    serviceSelect.innerHTML = 
    `<option value="">Select a service</option>`;

    services.forEach(service => {

        serviceCatalog[service.name] = {
            price: service.price
        };

        serviceSelect.innerHTML += `
            <option value="${service.name}">
                ${service.name} - ₱${service.price}
            </option>
        `;

    });

    updateReservationSummary();

})
.catch(error=>{
    console.log("Service loading error:", error);
});

const barbers = [
    "Mia Jose Silva",
    "Leo Ramos Cruz",
    "Ian Dizon"
];


const form = document.getElementById("booking-form");

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const summaryMessage = document.getElementById("summary-message");
const summaryDetails = document.getElementById("summary-details");

const barberDisplay = document.getElementById("barber-selection");
const barberName = document.getElementById("selected-barber");


// GET BARBER FROM URL
const requestedBarber = new URLSearchParams(window.location.search)
.get("barber");


const selectedBarber = barbers.includes(requestedBarber)
    ? requestedBarber
    : "";


const today = new Date();

today.setMinutes(
    today.getMinutes() - today.getTimezoneOffset()
);

dateInput.min = today.toISOString().slice(0,10);



if(selectedBarber){

    barberName.textContent = selectedBarber;
    barberDisplay.hidden = false;

}



function updateReservationSummary(){

    const selectedService = serviceSelect.value;

    const details = serviceCatalog[selectedService];


    if(!selectedService || !details){   

        summaryMessage.hidden = false;
        summaryDetails.hidden = true;

        return null;
    }


    document.getElementById("summary-service")
    .textContent = selectedService;


    document.getElementById("summary-price")
    .textContent = `₱${details.price}`;


    summaryMessage.hidden = true;
    summaryDetails.hidden = false;


    return details;

}



// LOAD SERVICE FROM URL

const requestedService = new URLSearchParams(window.location.search)
.get("service");


if(requestedService && serviceCatalog[requestedService]){

    serviceSelect.value = requestedService;

}


serviceSelect.addEventListener(
"change",
updateReservationSummary
);


updateReservationSummary();





// SUBMIT BOOKING

form.addEventListener("submit", function(event){

    event.preventDefault();


    const serviceDetails = updateReservationSummary();


    if(!serviceDetails){

        serviceSelect.focus();

        return;

    }



    const reservation = {


        customerName:
        document.getElementById("name").value,


        contactNumber:
        document.getElementById("contact").value,


        service:
        serviceSelect.value,

        price:
        serviceDetails.price,

        barber:
        selectedBarber,


        date:
        document.getElementById("date").value,


        time:
        document.getElementById("time").value,


        message:
        document.getElementById("message").value,
        status:"Pending"
    };



    console.log("Sending:", reservation);
    // SEND TO MONGODB

    fetch("http://localhost:5000/api/appointments",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(reservation)
    })
    .then(res=>res.json())
   .then(data=>{

    console.log("Saved:", data);

    const savedReservation = {
        ...reservation,
        _id: data._id || data.id
    };

    // Save for receipt display
    localStorage.setItem(
        "reservation",
        JSON.stringify(savedReservation)
    );
    localStorage.setItem("lastBookingId", savedReservation._id || "");

    alert("Appointment Saved!");

    window.location.href =
    "display_info.html";


})

    .catch(error=>{
        console.log("Error:",error);
        
    });

});