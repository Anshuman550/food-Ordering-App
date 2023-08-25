const express = require("express");

const router = express.Router();

// Load models and auth middleware
const auth = require("../middleware/auth");
const { getAllVendors, getVendorDetails, registerVendor, loginVendor, editVendor, deleteVendor } = require("../controllers/vendor");

// Get all vendors
router.get("/", auth, getAllVendors);

// Get a particular vendor
router.get("/details", auth, getVendorDetails);

// Add a vendor to the database
router.post("/register", registerVendor);

// Verify vendor credentials
router.post("/login", loginVendor);

// Edit a vendor's information
router.patch("/edit", auth, editVendor);

// Delete a vendor
router.delete("/delete", auth, deleteVendor);

module.exports = router;
