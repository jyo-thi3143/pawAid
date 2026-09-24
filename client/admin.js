// Get the container where we will display pending vets
const pendingContainer=document.getElementById("pending-container");

// Get pending vet listings from the API
async function fetchPendingVets(){
    try{
    const response = await fetch ("/api/vets/pending");

    if(!response.ok)
    {
        throw new Error("Failed to load pending listings");
    }

    const vets =await response.json();
     
    displayPendingVets(vets);
    }
    catch(error){
        pendingContainer.innerHTML= `
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

    // Refresh the pending list
    fetchPendingVets();

  } catch (error) {
    alert("❌ Could not approve listing.");
  }
}

// Delete a vet listing
async function deleteVet(id) {
  const confirmed = confirm("Are you sure you want to delete this listing?");

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

    // Refresh the pending list
    fetchPendingVets();

  } catch (error) {
    alert("❌ Could not delete listing.");
  }
}

// Load pending listings when the page opens
fetchPendingVets();




    



