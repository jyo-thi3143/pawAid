// ========================================
// ADMIN PAGE ELEMENTS
// ========================================

const pendingContainer = document.getElementById("pending-container");
const approvedContainer = document.getElementById("approved-container");
const binContainer = document.getElementById("bin-container");

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

const loginSection = document.getElementById("login-section");
const adminDashboard = document.getElementById("admin-dashboard");

const profileMenu = document.getElementById("profile-menu");
const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutButton = document.getElementById("logout-button");

const profileUsername = document.getElementById("profile-username");

const adminNavLinks = document.querySelectorAll(".admin-nav-link");
const adminPages = document.querySelectorAll(".admin-page");


// ========================================
// HELPER: GET ADMIN TOKEN
// ========================================

function getAdminToken() {
  return localStorage.getItem("adminToken");
}


// ========================================
// HELPER: ADMIN REQUEST HEADERS
// ========================================

function getAdminHeaders() {
  const token = getAdminToken();

  return {
    "Authorization": `Bearer ${token}`
  };
}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.message || "Login failed.";
      return;
    }

    // Save authentication token
    localStorage.setItem("adminToken", data.token);

    // Show dashboard
    loginSection.style.display = "none";
    adminDashboard.style.display = "block";

    // Show profile menu
    profileMenu.style.display = "block";
    profileUsername.textContent = username;

    // Clear login message/form
    loginMessage.textContent = "";
    loginForm.reset();

    // Start on Home
    showAdminPage("admin-home");

    // Load admin data
    fetchPendingVets();
    fetchApprovedVets();
    fetchDeletedVets();

  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Unable to connect to the server.";
  }
});


// ========================================
// ADMIN NAVIGATION
// ========================================

adminNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const pageId = link.getAttribute("data-page");

    showAdminPage(pageId);
    if(pageId == "bin-page"){
      fetchDeletedVets();

    }
  });
});


function showAdminPage(pageId) {
  adminPages.forEach((page) => {
    page.classList.remove("active-admin-page");
  });

  adminNavLinks.forEach((navLink) => {
    navLink.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);
  const selectedNavLink = document.querySelector(
    `.admin-nav-link[data-page="${pageId}"]`
  );

  if (selectedPage) {
    selectedPage.classList.add("active-admin-page");
  }

  if (selectedNavLink) {
    selectedNavLink.classList.add("active");
  }
}


// ========================================
// PROFILE MENU
// ========================================

profileButton.addEventListener("click", () => {
  profileDropdown.classList.toggle("show");
});


// ========================================
// LOG OUT
// ========================================

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");

  profileDropdown.classList.remove("show");

  profileMenu.style.display = "none";

  adminDashboard.style.display = "none";
  loginSection.style.display = "block";

  loginForm.reset();
  loginMessage.textContent = "";
});


// ========================================
// PENDING LISTINGS
// ========================================

async function fetchPendingVets() {
  try {
    const token = getAdminToken();

    const response = await fetch("/api/vets/pending", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load pending listings");
    }

    const vets = await response.json();

    displayPendingVets(vets);

  } catch (error) {
    console.error(error);

    pendingContainer.innerHTML = `
      <p>❌ Error loading pending listings.</p>
    `;
  }
}


// ========================================
// DISPLAY PENDING LISTINGS
// ========================================

function displayPendingVets(vets) {

  if (vets.length === 0) {
    pendingContainer.innerHTML = `
      <p>🎉 No pending listings!</p>
    `;

    return;
  }

  const html = vets.map((vet) => `
    <div class="vet-card">

      <h3>${escapeHtml(vet.name)}</h3>

      <p>
        📍 ${escapeHtml(vet.address)},
        ${escapeHtml(vet.city)},
        ${escapeHtml(vet.state)}
        ${escapeHtml(vet.zip)}
      </p>

      <p>📞 ${escapeHtml(vet.phone)}</p>

      <p>
        Services:
        ${vet.services.map(service => escapeHtml(service)).join(", ")}
      </p>

      ${
        vet.notes
          ? `<p>📝 ${escapeHtml(vet.notes)}</p>`
          : ""
      }

     <div class="admin-actions">

      <button onclick="approveVet('${vet._id}')">
        ✅ Approve
      </button>

      <button onclick="deleteVet('${vet._id}')">
        🗑️ Delete
      </button>
     </div>

    </div>

  `).join("");

  pendingContainer.innerHTML = html;
}


// ========================================
// APPROVE LISTING
// ========================================

async function approveVet(id) {

  try {
    const token = getAdminToken();

    const response = await fetch(`/api/vets/${id}/approve`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to approve listing");
    }

    alert("Vet listing approved!");

    fetchPendingVets();
    fetchApprovedVets();

  } catch (error) {
    console.error(error);
    alert("❌ Could not approve listing.");
  }
}


// ========================================
// DELETE PENDING LISTING
// ========================================

async function deleteVet(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this listing?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = getAdminToken();

    const response = await fetch(`/api/vets/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }

    alert("Vet listing deleted!");

    fetchPendingVets();

  } catch (error) {
    console.error(error);
    alert("❌ Could not delete listing.");
  }
}


// ========================================
// APPROVED LISTINGS
// ========================================

async function fetchApprovedVets() {

  try {
    const token = getAdminToken();

    const response = await fetch("/api/vets/approved", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load approved listings");
    }

    const vets = await response.json();

    displayApprovedVets(vets);

  } catch (error) {
    console.error(error);

    approvedContainer.innerHTML = `
      <p>❌ Error loading approved listings.</p>
    `;
  }
}
// ========================================
// SOFT DELETE LISTINGS
// ========================================

async function fetchDeletedVets() {
try{
  const response = await fetch ("/api/vets/bin",{
    headers: getAdminHeaders()
  });
  if(!response.ok){
    throw new Error("Failed to fetch deleted listings ");
  }
  const vets = await response.json();

  displayDeletedVets(vets);
}catch(error){
  console.error("Error fetching deleted listings:", error);
  binContainer.innerHTML = "<p>Unable to load deleted listings</p>";
}

}

// ========================================
// DISPLAY DELETED LISTINGS
// ========================================
function displayDeletedVets(vets) {
  if (vets.length === 0) {
    binContainer.innerHTML = "<p>The Bin is empty.</p>";
    return;
  }

  binContainer.innerHTML = vets.map(vet => `
    <div class="vet-card">
      <h3>${escapeHtml(vet.name)}</h3>
      <p>${escapeHtml(vet.address)}</p>
      <p>${escapeHtml(vet.city)}, ${escapeHtml(vet.state)} ${escapeHtml(vet.zip)}</p>
      <p>${escapeHtml(vet.phone)}</p>
      ${vet.website ? `<p><a href="${escapeHtml(vet.website)}" target="_blank" rel="noopener noreferrer">Website</a></p>` : ""}
      <p><strong>Deleted listing</strong></p>
    <div class="bin-actions">
      <button onclick = "restoreVet('${vet._id}')">
       ♻️ Restore
      </button>

      <button onclick="permanentlyDeleteVet('${vet._id}')">
       🗑️ Permanently Delete
      </button>
    </div>

    </div>

  `).join("");
}
async function restoreVet(id) {
  try {
    const response = await fetch(`/api/vets/${id}/restore`, {
      method: "PUT",
      headers: getAdminHeaders()
    });

    if (!response.ok) {
      throw new Error("Failed to restore listing");
    }

    await response.json();

    fetchDeletedVets();
    fetchPendingVets();
    fetchApprovedVets();

  } catch (error) {
    console.error("Error restoring listing:", error);
    alert("Unable to restore listing.");
  }
}

async function permanentlyDeleteVet(id) {
  const confirmed = window.confirm(
    "Permanently delete this listing? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`/api/vets/${id}/permanent`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "Failed to permanently delete listing");
    }

    await fetchDeletedVets();
  } catch (error) {
    console.error("Error permanently deleting listing:", error);
    alert(error.message || "Unable to permanently delete listing.");
  }
}

// ========================================
// DISPLAY APPROVED LISTINGS
// ========================================

function displayApprovedVets(vets) {

  if (vets.length === 0) {

    approvedContainer.innerHTML = `
      <p>There are no approved listings yet.</p>
    `;

    return;
  }

  const html = vets.map((vet) => `
    <div class="vet-card">

      <h3>${escapeHtml(vet.name)}</h3>

      <p>
        📍 ${escapeHtml(vet.address)},
        ${escapeHtml(vet.city)},
        ${escapeHtml(vet.state)}
        ${escapeHtml(vet.zip)}
      </p>

      <p>📞 ${escapeHtml(vet.phone)}</p>

      ${
        vet.website
          ? `<p>🌐 ${escapeHtml(vet.website)}</p>`
          : ""
      }

      <p>
        Services:
        ${vet.services.map(service => escapeHtml(service)).join(", ")}
      </p>

      ${
        vet.isFree
          ? `<p>💚 Free service</p>`
          : ""
      }

      ${
        vet.notes
          ? `<p>📝 ${escapeHtml(vet.notes)}</p>`
          : ""
      }
     <div class="admin-actions">


      <button onclick="editVet('${vet._id}')">
        ✏️ Edit
      </button>

      <button onclick="deleteApprovedVet('${vet._id}')">
        🗑️ Delete
      </button>
     </div>

    </div>
  `).join("");

  approvedContainer.innerHTML = html;
}


// ========================================
// EDIT APPROVED LISTING
// ========================================

async function editVet(id) {

  try {

    // This GET route is public, so authentication
    // is not required here.
    const response = await fetch(`/api/vets/${id}`);

    if (!response.ok) {
      throw new Error("Failed to load vet listing");
    }

    const vet = await response.json();

    approvedContainer.innerHTML = `
      <div class="edit-form">

        <h3>✏️ Edit Veterinary Listing</h3>

        <label for="edit-name">Clinic Name:</label>
        <input
          type="text"
          id="edit-name"
          value="${escapeHtml(vet.name)}"
        >

        <label for="edit-address">Address:</label>
        <input
          type="text"
          id="edit-address"
          value="${escapeHtml(vet.address)}"
        >

        <label for="edit-city">City:</label>
        <input
          type="text"
          id="edit-city"
          value="${escapeHtml(vet.city)}"
        >

        <label for="edit-state">State:</label>
        <input
          type="text"
          id="edit-state"
          value="${escapeHtml(vet.state)}"
          maxlength="2"
        >

        <label for="edit-zip">ZIP:</label>
        <input
          type="text"
          id="edit-zip"
          value="${escapeHtml(vet.zip)}"
        >

        <label for="edit-phone">Phone:</label>
        <input
          type="text"
          id="edit-phone"
          value="${escapeHtml(vet.phone)}"
        >

        <label for="edit-website">Website:</label>
        <input
          type="text"
          id="edit-website"
          value="${escapeHtml(vet.website || "")}"
        >

        <fieldset>

          <legend>Services:</legend>

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

        </fieldset>

        <label>
          <input
            type="checkbox"
            id="edit-isFree"
            ${vet.isFree ? "checked" : ""}
          >
          Free service
        </label>

        <label for="edit-notes">Notes:</label>

        <textarea id="edit-notes">${escapeHtml(vet.notes || "")}</textarea>

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
    console.error(error);
    alert("❌ Could not load listing for editing.");
  }
}


// ========================================
// SAVE VET CHANGES
// ========================================

async function saveVetChanges(id) {

  try {

    const checkedServices = document.querySelectorAll(
      ".edit-form .checkbox-group input:checked"
    );

    const services = Array.from(checkedServices).map(
      checkbox => checkbox.value
    );

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

    const token = getAdminToken();

    const response = await fetch(`/api/vets/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(updatedVet)
    });

    if (!response.ok) {

      const error = await response.json();

      throw new Error(
        error.message || "Failed to update listing"
      );
    }

    alert("✅ Vet listing updated successfully!");

    fetchApprovedVets();

  } catch (error) {

    console.error(error);

    alert(
      "❌ Could not update listing: " + error.message
    );
  }
}


// ========================================
// DELETE APPROVED LISTING
// ========================================

async function deleteApprovedVet(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this approved listing?"
  );

  if (!confirmed) {
    return;
  }

  try {

    const token = getAdminToken();

    const response = await fetch(`/api/vets/${id}`, {
      method: "DELETE",

      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }

    alert("🗑️ Approved listing deleted!");

    fetchApprovedVets();

  } catch (error) {

    console.error(error);

    alert("❌ Could not delete approved listing.");
  }
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
