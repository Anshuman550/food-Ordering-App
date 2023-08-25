const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // for .env file

// Creating express app
const app = express();

// assigning website port and database URL
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

// Set up middleware
app.use(cors());
app.use(express.json()); // used for managing request, it sets  body in request
app.use(express.urlencoded({ extended: true }))

// Serve static files which are stored in the folder images
app.use('/public/images', express.static(__dirname + '/public/images/'));

// Setup API endpoints
app.use("/api/buyers", require("./routes/buyer_route"));
app.use("/api/vendors", require("./routes/vendor_route"));
app.use("/api/items", require("./routes/item_route"));
app.use("/api/orders", require("./routes/order_route"));


// Connection to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("MongoDB database connection established successfully!");
    }
});

// Start the server
app.listen(port, function () {
    console.log(`Server is running on port ${port}!`);
});
