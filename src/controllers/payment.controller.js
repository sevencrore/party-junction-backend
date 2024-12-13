const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configuration
const MID = "PHONEPEDEMOUAT";
const saltKey = "a32fac47-cb1e-43bd-9402-5c855a8baff5";
const saltIndex = 1;
const urlPath = "/pg/v1/pay"; // The relative path used in X-VERIFY
const fullUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox${urlPath}`;

// Payment Request Handler
router.post("/create-payment", async (req, res) => {
  try {
    const { transactionId, userId, amount, redirectUrl, callbackUrl } = req.body;

    // Payload
    const requestPayload = {
      merchantId: MID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert amount to paise
      redirectUrl: "https://www.thepartyjunction.in/mybookings", // Default redirect URL
      redirectMode: "REDIRECT",
      callbackUrl: "https://www.thepartyjunction.in/payment/callback",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Step 1: Base64 encode the payload
    const base64Payload = Buffer.from(JSON.stringify(requestPayload)).toString("base64");

    // Step 2: Concatenate base64 payload, URL path, and salt key
    const verifyString = base64Payload + urlPath + saltKey;

    // Step 3: Generate SHA256 hash
    const sha256Hash = crypto.createHash("sha256").update(verifyString).digest("hex");

    // Step 4: Append the salt index
    const xVerify = `${sha256Hash}###${saltIndex}`;

    // Step 5: Send the request to PhonePe
    const response = await axios.post(
      fullUrl,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
        },
      }
    );

    // Return PhonePe response
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

router.post("/callback", (req, res) => {
  try {
    const callbackData = req.body;

    // Define the file path where the callback data will be saved
    const filePath = path.join(__dirname, "../logs/callback-responses.json");

    // Read the existing file content, if any
    fs.readFile(filePath, "utf8", (err, data) => {
      let existingData = [];
      if (!err && data) {
        try {
          existingData = JSON.parse(data);
        } catch (parseErr) {
          console.error("Error parsing existing file data:", parseErr);
        }
      }

      // Append the new callback data to the existing data
      existingData.push(callbackData);

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing to callback file:", writeErr);
          return res.status(500).json({ success: false, message: "Failed to log callback data" });
        }

        console.log("Callback data logged successfully:", callbackData);
        return res.status(200).json({ success: true, message: "Callback data logged successfully" });
      });
    });
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(500).json({ success: false, message: "Error processing callback" });
  }
});

module.exports = router;


module.exports = router;
