const express = require("express");
const router = express.Router();
const Vet = require("../models/Vet");

router.get("/", async (req, res) => {
  try {
    const { zip, service } = req.query;
    let filter = { isApproved: true };
    if (zip) filter.zip = zip;
    if (service) filter.services = { $in: [service] };
    const vets = await Vet.find(filter).sort({ createdAt: -1 });
    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) return res.status(404).json({ message: "Vet listing not found" });
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newVet = new Vet(req.body);
    const savedVet = await newVet.save();
    res.status(201).json(savedVet);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedVet = await Vet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVet) return res.status(404).json({ message: "Vet listing not found" });
    res.status(200).json(updatedVet);
  } catch (error) {
    res.status(400).json({ message: "Update error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedVet = await Vet.findByIdAndDelete(req.params.id);
    if (!deletedVet) return res.status(404).json({ message: "Vet listing not found" });
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;