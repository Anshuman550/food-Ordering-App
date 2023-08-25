const jwt = require('jsonwebtoken');
const fs = require('fs')
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
         
        if (!token) {
            return res.status(401).json({
                error: "Authorization denied due to lack of token",
            });
        }
        var key = fs.readFileSync('key_files.pub'); // it is advised to use your own key when you are running this project

        const decoded = jwt.verify(token, /*process.env.JWT_SECRET*/key);      // decoding the token based on JWT secret
        //console.log(decoded)
        if (!decoded) {
            return res.status(401).json({
                error: "Token is not valid",
            });
        }

        req.user = decoded.id;// we are provding user to 
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: "Authorization denied due to token expiry",
            });
        }
        console.log("probabily wrong token")
        res.status(500).json({
            error: err,
            token : req.headers.authorization
        });
    }
}

module.exports = auth;