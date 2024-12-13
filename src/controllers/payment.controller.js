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
      callbackUrl: "https://api.thepartyjunction.in/payment/callback",
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
    // Extract headers and body
    const { headers, body } = req;
    const receivedXVerify = headers["x-verify"];
    const receivedResponse = body.response; // This is already Base64-encoded
    console.log(body);

    // Step 1: Recompute X-VERIFY
    // const verifyString = receivedResponse + urlPath + saltKey; // Only use `response`, not the entire body

    // // Step 2: Generate SHA256 hash
    // const sha256Hash = crypto.createHash("sha256").update(verifyString).digest("hex");

    // // Step 3: Append the salt index
    // const recomputedXVerify = `${sha256Hash}###${saltIndex}`;

    // console.log("Received X-Verify:", receivedXVerify);
    // console.log("Recomputed X-Verify:", recomputedXVerify);

    // // Step 2: Validate X-VERIFY
    // if (receivedXVerify !== recomputedXVerify) {
    //   console.error("X-Verify mismatch! Possible tampering detected.");
    //   return res.status(400).send({ error: "Invalid X-Verify checksum." });
    // }

    // Step 3: Decode and process the response
    const decodedResponse = JSON.parse(
      Buffer.from(receivedResponse, "base64").toString("utf-8")
    );
    console.log("Decoded Response:", decodedResponse);

    // Step 4: Save the received data for debugging
    const logData = {
      headers,
      decodedResponse,
    };
    const filePath = path.join(__dirname, "callback-log.json");
    fs.writeFileSync(filePath, JSON.stringify(logData, null, 2), "utf-8");

    // Step 5: Respond to the gateway
    res.status(200).send({ status: "received", ...decodedResponse });
  } catch (error) {
    console.error("Error processing callback:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;


module.exports = router;
