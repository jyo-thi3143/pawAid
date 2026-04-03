const mongoose = require("mongoose");

const vetSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    address:   { type: String, required: true, trim: true },
    city:      { type: String, required: true, trim: true },
    state:     { type: String, required: true, trim: true, uppercase: true, maxlength: 2 },
    zip:       { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    website:   { type: String, trim: true, default: "" },
    services:  { type: [String], enum: ["vaccines", "spay", "neuter", "checkup", "dental", "emergency"], required: true },
    isFree:    { type: Boolean, default: false },
    notes:     { type: String, trim: true, default: "", maxlength: 500 },
    isApproved:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vet", vetSchema);