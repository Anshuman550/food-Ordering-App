const express = require("express");
const router = express.Router();

// Load models and auth middleware
const auth = require('../middleware/auth');
const { getDetails, register, login, edit, updateWallet, addFavourite, removeFavourite, deleteBuyer, getAll } = require("../controllers/buyer");

// sharing all buyer list to this end point
router.get("/", auth, getAll);//it is very unsafe practice to share all the user info or data at some end point

// get the detail of of perticular buyer ( you can find buyer id using token )
router.get("/details", auth, getDetails);

// register a new buyer account, first checking that the given email email should not already existed, then make a new data base entry for buyer with all info 
router.post("/register", register);

// Verify buyer credentials, validating username with correct password ( varify it using bicrypt )
router.post("/login", login);

// Edit a buyer's profile information, like phone number, name and password, correction in email is not allowed
router.patch("/edit", auth, edit);

// Update a buyer's amount in wallet
router.patch("/update_wallet", auth, updateWallet);

// add a perticual food item to the faourets of the buyer( item id is attached in request, and you can find buyer using token )
router.patch("/add_favourite", auth, addFavourite);

// Remove from a buyer's favourite list
router.patch("/remove_favourite", auth, removeFavourite);

// Delete a buyer
router.delete("/delete", auth, deleteBuyer);

module.exports = router;
