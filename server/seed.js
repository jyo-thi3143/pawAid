require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Vet = require("./models/Vet");

const sampleVets = [
  {
    name: "ASPCA Animal Hospital",
    address: "424 E 92nd St",
    city: "New York",
    state: "NY",
    zip: "10128",
    phone: "(212) 876-7700",
    website: "https://www.aspca.org",
    services: ["vaccines", "spay", "neuter", "checkup"],
    isFree: false,
    notes: "Sliding scale fees based on income. Bring proof of income.",
    isApproved: true,
  },
  {
    name: "NYC ACC Low-Cost Clinic",
    address: "326 E 110th St",
    city: "New York",
    state: "NY",
    zip: "10029",
    phone: "(212) 788-4000",
    website: "https://www.nycacc.org",
    services: ["vaccines", "spay", "neuter"],
    isFree: true,
    notes: "Free services for qualifying low-income pet owners. ID required.",
    isApproved: true,
  },
  {
    name: "Humane Society Vet Clinic",
    address: "306 Lenox Rd",
    city: "Brooklyn",
    state: "NY",
    zip: "11226",
    phone: "(718) 544-3000",
    website: "",
    services: ["vaccines", "checkup"],
    isFree: false,
    notes: "Affordable wellness exams. Call ahead for appointment.",
    isApproved: true,
  },
  {
    name: "Animal Care Center - Staten Island",
    address: "3139 Veterans Rd W",
    city: "Staten Island",
    state: "NY",
    zip: "10309",
    phone: "(212) 788-4000",
    website: "https://www.nycacc.org",
    services: ["vaccines", "spay", "neuter", "checkup"],
    isFree: false,
    notes: "Low-cost services. Income verification required at check-in.",
    isApproved: true,
  },
  {
    name: "Bronx Veterinary Center",
    address: "2460 Grand Concourse",
    city: "Bronx",
    state: "NY",
    zip: "10458",
    phone: "(718) 367-8668",
    website: "",
    services: ["vaccines", "dental", "checkup"],
    isFree: false,
    notes: "Reduced fees for seniors and low-income owners. Spanish spoken.",
    isApproved: true,
  },
  {
    name: "Queens Animal Hospital",
    address: "89-06 Jamaica Ave",
    city: "Queens",
    state: "NY",
    zip: "11421",
    phone: "(718) 849-2500",
    website: "",
    services: ["vaccines", "spay", "neuter"],
    isFree: false,
    notes: "Offers payment plans. No pet turned away for lack of funds.",
    isApproved: true,
  },
  {
    name: "Urban Vets Free Clinic",
    address: "540 Atlantic Ave",
    city: "Brooklyn",
    state: "NY",
    zip: "11217",
    phone: "(718) 422-0100",
    website: "",
    services: ["vaccines"],
    isFree: true,
    notes: "Free vaccine clinics every Saturday 10am-2pm. First come first served.",
    isApproved: true,
  },
  {
    name: "Harlem Animal Clinic",
    address: "162 W 125th St",
    city: "New York",
    state: "NY",
    zip: "10027",
    phone: "(212) 932-0011",
    website: "",
    services: ["vaccines", "checkup", "emergency"],
    isFree: false,
    notes: "Community clinic serving Harlem residents. Sliding scale available.",
    isApproved: true,
  },
];

async function seedDatabase() {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Step 2: Delete all existing vet listings
    await Vet.deleteMany({});
    console.log("🗑️  Cleared existing listings");

    // Step 3: Insert all 8 sample vets at once
    const inserted = await Vet.insertMany(sampleVets);
    console.log(`🌱 Inserted ${inserted.length} vet listings`);

    // Step 4: Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    console.log("\n✅ Done! Now run npm run dev and test your API.");

  } catch (error) {
    console.error(" Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();