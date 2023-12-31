const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fs = require('fs')
// Load models and auth middleware
const Vendor = require("../models/vendor_model");

// Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        return res.status(200).json(vendors);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Get a particular vendor
exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user);
        return res.status(200).json(vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Add a vendor to the database
exports.registerVendor = async (req, res) => {
    try {
        // Verify if the vendor doesn't already exist
        const vendor = await Vendor.findOne({ email: req.body.email });
        if (vendor) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        const duplicate_vendor = await Vendor.findOne({ shop_name: req.body.shop_name });
        if (duplicate_vendor) {
            return res.status(409).json({
                error: "Shop name already exists",
            });
        }

        // Create a new vendor
        const new_vendor = new Vendor({
            shop_name: req.body.shop_name,
            manager_name: req.body.manager_name,
            email: req.body.email,
            number: req.body.number,
            opening_time: req.body.opening_time,
            closing_time: req.body.closing_time,
        });

        // Hash the password
        const salt = await bcrypt.genSalt();
        new_vendor.password = await bcrypt.hash(req.body.password, salt);
        var privateKey = fs.readFileSync('private_key');
        // Create and assign a token
        jwt.sign({
            id: new_vendor._id,
            type: "vendor",
        }, privateKey, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm : 'RS256'
        }, async (err, token) => {
            if (err) {
                return res.status(500).json({
                    error: "Error signing token",
                });
            }

            // Return the token and the vendor data
            const saved_vendor = await new_vendor.save();
            return res.status(201).json({
                token: token,
                type: "vendor",
                vendor: saved_vendor
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

// Verify vendor credentials
exports.loginVendor = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({
                error: "Email not found",
            });
        }

        // Verify password
        
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Incorrect password",
            });
        }
        var privateKey = fs.readFileSync('private_key');
        // Create and assign a token
        //privateKey = 'ewr'
        jwt.sign({
            id: vendor._id,
            type: "vendor",
        }, privateKey, { algorithm : 'RS256', expiresIn: process.env.JWT_EXPIRES_IN}, (err, token) => {
            if (err) {
                return res.status(500).json({
                    error: "Error signing token",
                });
            }

            // Return the token and the vendor data
            return res.status(200).json({
                token: token,
                type: "vendor",
                vendor: {
                    shop_name: vendor.shop_name,
                    manager_name: vendor.manager_name,
                    email: vendor.email,
                    number: vendor.number,
                    opening_time: vendor.opening_time,
                    closing_time: vendor.closing_time,
                }
            });
        }); 
       
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Edit a vendor's information
exports.editVendor = async (req, res) => {
    try {
        // Find user with same email
        
        let vendor = await Vendor.findById(req.user);

        vendor.shop_name = req.body.shop_name;
        vendor.manager_name = req.body.manager_name;
        //vendor.email = req.body.email;
        vendor.number = req.body.number;
        vendor.opening_time = req.body.opening_time;
        vendor.closing_time = req.body.closing_time;

        // Hash the password
        if (req.body.password !== "") {
            const salt = await bcrypt.genSalt();
            vendor.password = await bcrypt.hash(req.body.password, salt);
        }

        const saved_vendor = await Vendor.findByIdAndUpdate(req.user, vendor, {
            new: true
        });

        return res.status(200).json(saved_vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Delete a vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.user);
        return res.status(200).json(vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}
