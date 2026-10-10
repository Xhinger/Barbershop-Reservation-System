document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        history.pushState(null, "", link.getAttribute("href"));
    });
});

// GET SERVICES FROM MONGODB

fetch("http://localhost:5000/api/services")

.then(response => response.json())

.then(services => {

    const container = document.getElementById("service-container");


    services.forEach(service => {

        container.innerHTML += `

        <div class="card">

            <article class="haircut-1">

                <div>

                    <h3>${service.name}</h3>

                    <p>
                    ${service.description}
                    </p>

                </div>


                <div>

                    <p class="price">
                    Starting at 
                    <span>₱${service.price}</span>
                    </p>


                    <a href="booking.html?service=${service.name}">
                    Book <span>Now</span>
                    </a>

                </div>

            </article>

        </div>

        `;

    });


})

.catch(error => {

    console.log("Error loading services:", error);

});


