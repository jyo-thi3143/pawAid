const express = require("express");
const router = express.Router();
const Vet = require("../models/Vet");

// ============================================================
// GET /api/vets
// Get approved vet listings
// Optional filters: zip and service
// ============================================================
router.get("/", async (req, res) => {
  try {
    const { zip, service } = req.query;

    let filter = { isApproved: true };

    if (zip) filter.zip = zip;
    if (service) filter.services = { $in: [service] };

    const vets = await Vet.find(filter).sort({ createdAt: -1 });

    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// ============================================================
// GET /api/vets/pending
// Get listings waiting for admin approval
// ============================================================
router.get("/pending", async (req, res) => {
  try {
    const vets = await Vet.find({ isApproved: false })
      .sort({ createdAt: -1 });

    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// ============================================================
// GET /api/vets/approved
// Get all approved listings for the admin portal
// ============================================================
router.get("/approved", async (req, res) => {
  try {
    const vets = await Vet.find({ isApproved: true })
      .sort({ createdAt: -1 });

    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// ============================================================
// PUT /api/vets/:id/approve
// Approve a pending vet listing
// ============================================================
router.put("/:id/approve", async (req, res) => {
  try {
    const updatedVet = await Vet.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true, runValidators: true }
    );

    if (!updatedVet) {
      return res.status(404).json({
        message: "Vet listing not found"
      });
    }

    res.status(200).json(updatedVet);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// ============================================================
// GET /api/vets/:id
// Get one vet listing by ID
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);

    if (!vet) {
      return res.status(404).json({
        message: "Vet listing not found"
      });
    }

    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// ============================================================
// POST /api/vets
// Submit a new vet listing
// Checks for duplicate listings first
// ============================================================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zip
    } = req.body;

    // Check if this vet listing already exists
    const existingVet = await Vet.findOne({
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip
    });

    if (existingVet) {
      return res.status(409).json({
        message:
          "A veterinary listing with this name and address already exists."
      });
    }

    // Create the new listing
    // isApproved will be false by default
    const newVet = new Vet(req.body);

    const savedVet = await newVet.save();

    res.status(201).json(savedVet);
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      error: error.message
    });
  }
});

// ============================================================
// PUT /api/vets/:id
// Update an existing vet listing
// ============================================================
router.put("/:id", async (req, res) => {
  try {
    const updatedVet = await Vet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedVet) {
      return res.status(404).json({
        message: "Vet listing not found"
      });
    }

    res.status(200).json(updatedVet);
  } catch (error) {
    res.status(400).json({
      message: "Update error",
      error: error.message
    });
  }
});

// ============================================================
// DELETE /api/vets/:id
// Delete a vet listing
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedVet = await Vet.findByIdAndDelete(req.params.id);

    if (!deletedVet) {
      return res.status(404).json({
        message: "Vet listing not found"
      });
    }

    res.status(200).json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;