const mongoose = require("mongoose");

const communityReportSchema = new mongoose.Schema(
  {
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vet",
      required: true
    },

    reason: {
      type: String,
      enum: [
        "phone",
        "address",
        "website",
        "services",
        "closed",
        "other"
      ],
      required: true
    },

    details: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CommunityReport",
  communityReportSchema
);