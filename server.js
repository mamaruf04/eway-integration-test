const express = require("express");
const cors = require("cors");
const rapid = require("eway-rapid"); // Assuming you're using eway-rapid
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual credentials
const apiKey = process.env.EWAY_API_KEY;
const password = process.env.EWAY_PASSWORD;
const rapidEndpoint = process.env.EWAY_RAPID_ENDPOINT;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Extract SecuredCardData (handle potential absence)
    const SecuredCardData = body?.SecureFieldCode;
    console.log({ SecuredCardData });

    // Create a Rapid client with your credentials and endpoint
    const client = rapid.createClient(apiKey, password, rapidEndpoint);

    // Create a customer using the provided details
    // const response = await client.createCustomer(rapid.Enum.Method.DIRECT, {
    //   Title: "Mr.",
    //   FirstName: body?.data?.firstName || "test", // Use data from request or default
    //   LastName: body?.data?.lastName || "test", // Use data from request or default
    //   Country: "au",
    //   SecuredCardData: SecuredCardData,
    //   // CardDetails: {
    //   //   Name: "test",
    //   //   Number: "5105105105105100",
    //   //   ExpiryMonth: "12",
    //   //   ExpiryYear: "25",
    //   //   CVN: "123"
    //   // }
    // });

      const response = await client.createTransaction(rapid.Enum.Method.DIRECT, {
        "Payment": {
           "TotalAmount": 100
        },
        "SecuredCardData": SecuredCardData,
    });

    // Extract the Customer object from the response
    const Customer = response.get("Customer");

    // Log the response and Customer object for debugging
    console.log(response, { Customer });

    // Send a successful response with the Customer data
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
