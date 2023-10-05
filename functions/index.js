const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors"); // Import the cors package

admin.initializeApp();

// Use the cors middleware
const corsHandler = cors({origin: true});

exports.checkCode = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, () => { // Use the cors middleware in your function
    res.set("Access-Control-Allow-Origin", "*"); // Set the allowed origin
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS"); // Set the allowed methods
    res.set("Access-Control-Allow-Headers", "Content-Type"); // Set the allowed headers
    try {
      const {codeParam} = req.body.data;
      if (process.env.ATTR_CODE === codeParam) {
        res.send({
          "status": 200,
          "data": true,
        });
      } else {
        res.send({
          "status": 200,
          "data": false,
        });
      }
    } catch (error) {
      res.status(500).json({status: false, error});
    }
  });
});
