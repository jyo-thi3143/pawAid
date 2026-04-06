// ============================================================
// app.js — Frontend JavaScript
// ============================================================
// This file does 3 things:
//   1. Fetches vet listings from your API and displays them
//   2. Handles search and filter
//   3. Handles the submit form
// ============================================================

// The base URL of your API
// This is the only place you need to change it if your port changes
const API_URL = "http://localhost:5001/api/vets";

// ---- Grab all the HTML elements we need ----
// document.getElementById() finds an element by its id="" attribute
const vetContainer    = document.getElementById("vet-container");
const zipInput        = document.getElementById("zip-input");
const serviceSelect   = document.getElementById("service-select");
const searchBtn       = document.getElementById("search-btn");
const clearBtn        = document.getElementById("clear-btn");
const submitForm      = document.getElementById("submit-form");
const formMessage     = document.getElementById("form-message");


// ============================================================
// FUNCTION 1 — fetchVets(zip, service)
// Fetches vet listings from the API and displays them
// ============================================================
async function fetchVets(zip = "", service = "") {
  // Build the URL — add filters if they exist
  // e.g. http://localhost:5001/api/vets?zip=11226&service=vaccines
  let url = API_URL;
  const params = [];
  if (zip)     params.push(`zip=${zip}`);
  if (service) params.push(`service=${service}`);
  if (params.length > 0) url += "?" + params.join("&");

  try {
    // fetch() sends a GET request to the URL
    // await pauses here until the server responds
    const response = await fetch(url);

    // .json() converts the raw response into a JavaScript array
    const vets = await response.json();

    // Pass the array to our display function
    displayVets(vets);

  } catch (error) {
    // If fetch fails (e.g. server is off) show an error
    vetContainer.innerHTML = "<p>Error loading listings. Is your server running?</p>";
  }
}


// ============================================================
// FUNCTION 2 — displayVets(vets)
// Takes an array of vet objects and builds HTML cards
// ============================================================
function displayVets(vets) {
  // If no vets came back, show a message
  if (vets.length === 0) {
    vetContainer.innerHTML = "<p>No listings found. Try a different search.</p>";
    return; // stop the function here
  }

  // .map() loops through every vet and turns it into an HTML string
  // Then .join("") glues all those strings together into one big string
  const html = vets.map(vet => `
    <div class="vet-card">

      <div class="card-header">
        <h3>${vet.name}</h3>
        ${vet.isFree
          ? '<span class="badge free">FREE</span>'
          : '<span class="badge affordable">Affordable</span>'
        }
      </div>

      <p class="address">
        📍 ${vet.address}, ${vet.city}, ${vet.state} ${vet.zip}
      </p>

      <p class="phone">📞 ${vet.phone}</p>

      ${vet.website
        ? `<p><a href="${vet.website}" target="_blank">🌐 Visit Website</a></p>`
        : ""
      }

      <div class="services">
        ${vet.services.map(s => `<span class="service-tag">${s}</span>`).join("")}
      </div>

      ${vet.notes
        ? `<p class="notes">📝 ${vet.notes}</p>`
        : ""
      }

    </div>
  `).join("");

  // Inject all the cards into the page
  vetContainer.innerHTML = html;
}


// ============================================================
// FUNCTION 3 — Handle search button click
// ============================================================
searchBtn.addEventListener("click", () => {
  // .trim() removes accidental spaces before/after
  const zip     = zipInput.value.trim();
  const service = serviceSelect.value;
  fetchVets(zip, service);
});


// ============================================================
// FUNCTION 4 — Handle clear button click
// ============================================================
clearBtn.addEventListener("click", () => {
  zipInput.value      = "";
  serviceSelect.value = "";
  fetchVets(); // fetch all with no filters
});


// ============================================================
// FUNCTION 5 — Handle form submission (POST a new vet)
// ============================================================
submitForm.addEventListener("submit", async (e) => {
  // Prevent the default form behavior (page reload)
  e.preventDefault();

  // Collect all checked service checkboxes into an array
  const checkedBoxes = document.querySelectorAll(".checkbox-group input:checked");
  const services = Array.from(checkedBoxes).map(cb => cb.value);

  // Build the vet object from the form fields
  const newVet = {
    name:    document.getElementById("name").value.trim(),
    address: document.getElementById("address").value.trim(),
    city:    document.getElementById("city").value.trim(),
    state:   document.getElementById("state").value.trim(),
    zip:     document.getElementById("zip").value.trim(),
    phone:   document.getElementById("phone").value.trim(),
    website: document.getElementById("website").value.trim(),
    notes:   document.getElementById("notes").value.trim(),
    services: services,
    isFree:  document.getElementById("isFree").checked,
  };

  try {
    // fetch() with method POST sends data TO the server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tell server we're sending JSON
      },
      body: JSON.stringify(newVet), // convert JS object to JSON string
    });

    if (response.ok) {
      formMessage.textContent = "✅ Listing submitted! It will appear after review.";
      formMessage.style.color = "green";
      submitForm.reset(); // clear the form
    } else {
      const error = await response.json();
      formMessage.textContent = "❌ Error: " + error.message;
      formMessage.style.color = "red";
    }

  } catch (error) {
    formMessage.textContent = "❌ Could not connect to server.";
    formMessage.style.color = "red";
  }
});


// ============================================================
// START — Load all vets when the page first opens
// ============================================================
// This runs immediately when app.js loads
fetchVets();