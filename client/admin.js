// Get the containers where we will display vet listings
const pendingContainer = document.getElementById("pending-container");
const approvedContainer = document.getElementById("approved-container");


// ===============================
// PENDING LISTINGS
// ===============================

// Get pending vet listings from the API
async function fetchPendingVets() {
  try {
    const response = await fetch("/api/vets/pending");

    if (!response.ok) {
      throw new Error("Failed to load pending listings");
    }

    const vets = await response.json();

    displayPendingVets(vets);

  } catch (error) {
    pendingContainer.innerHTML = `
      <p>❌ Error loading pending listings.</p>
    `;
  }
}


// Display the pending vet listings on the page
function displayPendingVets(vets) {

  if (vets.length === 0) {
    pendingContainer.innerHTML = `
      <p>🎉 No pending listings!</p>
    `;
    return;
  }

  const html = vets.map(vet => `
    <div class="vet-card">

      <h3>${vet.name}</h3>

      <p>📍 ${vet.address}, ${vet.city}, ${vet.state} ${vet.zip}</p>

      <p>📞 ${vet.phone}</p>

      <p>
        Services:
        ${vet.services.join(", ")}
      </p>

      ${vet.notes
        ? `<p>📝 ${vet.notes}</p>`
        : ""
      }

      <button onclick="approveVet('${vet._id}')">
        ✅ Approve
      </button>

      <button onclick="deleteVet('${vet._id}')">
        🗑️ Delete
      </button>

    </div>
  `).join("");

  pendingContainer.innerHTML = html;
}


// Approve a vet listing
async function approveVet(id) {

  try {

    const response = await fetch(`/api/vets/${id}/approve`, {
      method: "PUT"
    });

    if (!response.ok) {
      throw new Error("Failed to approve listing");
    }

    alert("Vet listing approved!");

    // Refresh both sections
    fetchPendingVets();
    fetchApprovedVets();

  } catch (error) {

    alert("❌ Could not approve listing.");

  }
}


// Delete a pending vet listing
async function deleteVet(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this listing?"
  );

  if (!confirmed) {
    return;
  }

  try {

    const response = await fetch(`/api/vets/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }

    alert("Vet listing deleted!");

    // Refresh pending listings
    fetchPendingVets();

  } catch (error) {

    alert("❌ Could not delete listing.");

  }
}



// ===============================
// APPROVED LISTINGS
// ===============================

// Get approved vet listings from the API
async function fetchApprovedVets() {

  try {

    const response = await fetch("/api/vets/approved");

    if (!response.ok) {
      throw new Error("Failed to load approved listings");
    }

    const vets = await response.json();

    displayApprovedVets(vets);

  } catch (error) {

    approvedContainer.innerHTML = `
      <p>❌ Error loading approved listings.</p>
    `;

  }
}


// Display approved vet listings
function displayApprovedVets(vets) {

  if (vets.length === 0) {

    approvedContainer.innerHTML = `
      <p>There are no approved listings yet.</p>
    `;

    return;
  }


  const html = vets.map(vet => `
    <div class="vet-card">

      <h3>${vet.name}</h3>

      <p>
        📍 ${vet.address}, ${vet.city}, ${vet.state} ${vet.zip}
      </p>

      <p>📞 ${vet.phone}</p>

      ${vet.website
        ? `<p>🌐 ${vet.website}</p>`
        : ""
      }

      <p>
        Services:
        ${vet.services.join(", ")}
      </p>

      ${vet.isFree
        ? `<p>💚 Free service</p>`
        : ""
      }

      ${vet.notes
        ? `<p>📝 ${vet.notes}</p>`
        : ""
      }

      <button onclick="editVet('${vet._id}')">
        ✏️ Edit
      </button>

      <button onclick="deleteApprovedVet('${vet._id}')">
        🗑️ Delete
      </button>

    </div>
  `).join("");


  approvedContainer.innerHTML = html;
}



// ===============================
// EDIT APPROVED LISTING
// ===============================

async function editVet(id) {
  try {
    // Get the current vet information
    const response = await fetch(`/api/vets/${id}`);

    if (!response.ok) {
      throw new Error("Failed to load vet listing");
    }

    const vet = await response.json();

    // Create the edit form
    approvedContainer.innerHTML = `
      <div class="edit-form">

        <h3>✏️ Edit Veterinary Listing</h3>

        <label>Clinic Name:</label>
        <input
          type="text"
          id="edit-name"
          value="${vet.name}"
        >

        <label>Address:</label>
        <input
          type="text"
          id="edit-address"
          value="${vet.address}"
        >

        <label>City:</label>
        <input
          type="text"
          id="edit-city"
          value="${vet.city}"
        >

        <label>State:</label>
        <input
          type="text"
          id="edit-state"
          value="${vet.state}"
          maxlength="2"
        >

        <label>ZIP:</label>
        <input
          type="text"
          id="edit-zip"
          value="${vet.zip}"
        >

        <label>Phone:</label>
        <input
          type="text"
          id="edit-phone"
          value="${vet.phone}"
        >

        <label>Website:</label>
        <input
          type="text"
          id="edit-website"
          value="${vet.website || ""}"
        >

        <label>Services:</label>

        <div class="checkbox-group">

          <label>
            <input
              type="checkbox"
              value="vaccines"
              ${vet.services.includes("vaccines") ? "checked" : ""}
            >
            Vaccines
          </label>

          <label>
            <input
              type="checkbox"
              value="spay"
              ${vet.services.includes("spay") ? "checked" : ""}
            >
            Spay
          </label>

          <label>
            <input
              type="checkbox"
              value="neuter"
              ${vet.services.includes("neuter") ? "checked" : ""}
            >
            Neuter
          </label>

          <label>
            <input
              type="checkbox"
              value="checkup"
              ${vet.services.includes("checkup") ? "checked" : ""}
            >
            Checkup
          </label>

          <label>
            <input
              type="checkbox"
              value="dental"
              ${vet.services.includes("dental") ? "checked" : ""}
            >
            Dental
          </label>

          <label>
            <input
              type="checkbox"
              value="emergency"
              ${vet.services.includes("emergency") ? "checked" : ""}
            >
            Emergency
          </label>

        </div>

        <label>
          <input
            type="checkbox"
            id="edit-isFree"
            ${vet.isFree ? "checked" : ""}
          >
          Free service
        </label>

        <label>Notes:</label>

        <textarea id="edit-notes">${vet.notes || ""}</textarea>

        <br>

        <button onclick="saveVetChanges('${vet._id}')">
          💾 Save Changes
        </button>

        <button onclick="fetchApprovedVets()">
          Cancel
        </button>

      </div>
    `;
  } catch (error) {
    alert("❌ Could not load listing for editing.");
  }
}

// ===============================
// SAVE VET CHANGES
// ===============================
async function saveVetChanges(id) {
  try {

    // Get selected services
    const checkedServices = document.querySelectorAll(
      ".edit-form .checkbox-group input:checked"
    );

    const services = Array.from(checkedServices).map(
      checkbox => checkbox.value
    );


    // Create updated vet object
    const updatedVet = {
      name: document.getElementById("edit-name").value.trim(),
      address: document.getElementById("edit-address").value.trim(),
      city: document.getElementById("edit-city").value.trim(),
      state: document.getElementById("edit-state").value.trim(),
      zip: document.getElementById("edit-zip").value.trim(),
      phone: document.getElementById("edit-phone").value.trim(),
      website: document.getElementById("edit-website").value.trim(),
      services: services,
      isFree: document.getElementById("edit-isFree").checked,
      notes: document.getElementById("edit-notes").value.trim()
    };


    // Send updated information to backend
    const response = await fetch(`/api/vets/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(updatedVet)
    });


    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to update listing");
    }


    alert("✅ Vet listing updated successfully!");


    // Show the approved listings again
    fetchApprovedVets();

  } catch (error) {

    alert("❌ Could not update listing: " + error.message);

  }
}



// ===============================
// DELETE APPROVED LISTING
// ===============================

async function deleteApprovedVet(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this approved listing?"
  );

  if (!confirmed) {
    return;
  }


  try {

    const response = await fetch(`/api/vets/${id}`, {
      method: "DELETE"
    });


    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }


    alert("🗑️ Approved listing deleted!");


    // Refresh approved listings
    fetchApprovedVets();


  } catch (error) {

    alert("❌ Could not delete approved listing.");

  }
}



// ===============================
// LOAD LISTINGS
// ===============================

// Load both sections when the page opens
fetchPendingVets();
fetchApprovedVets();