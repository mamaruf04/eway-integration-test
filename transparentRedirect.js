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

// Create a Rapid client with your credentials and endpoint
const client = rapid.createClient(apiKey, password, rapidEndpoint);


app.get("/", async (req, res) => {
  // create a customer using the AccessCode
  try {
    const response = await client.createTransaction(
      rapid.Enum.Method.TRANSPARENT_REDIRECT,
      {
        Payment: {
          TotalAmount: 10,
        },
        Customer: {
            "Title": "Mr.",
            "FirstName": "transperant",
            "LastName": "test",
            "Country": "au",
         },
        RedirectUrl: "https://example.com/",
        TransactionType: "Recurring",
        CurrencyCode: "AUD",
        Method: "CreateTokenCustomer",
        SaveCustomer: true,
      }
    );
    console.log(response);
    res.send(response);
  } catch (error) {
    res.send("error ", error);
  }
});


app.get("/queryCustomer", async (req, res) => {

  // query a customer using the AccessCode
  try {
    const response = await client.queryTransaction("60CF3BrhYrDeiJkkjurP5GL2jtZrDU8V1NZEz629tVJN731vmZGEvfhuNPyW3-pLRZbpkaUiOaZRCDnMbzJ2YbhTMQNRINtGeuM_nHJxwhl7UNTyBHTn6rkCqt6tjLypUOrSHrceCJ0xgZbIiUWpaYBsSjQ==")

    console.log(response);

    res.send(response);
  } catch (error) {
    res.send("error ", error);
  }
});



// not used in transparent redirect

// app.post("/", async (req, res) => {
//   try {
//     const body = req.body;

//     // Create a customer using the provided details

//     const response = await client.createTransaction(
//       rapid.Enum.Method.TRANSPARENT_REDIRECT,
//       {
//         Payment: {
//           TotalAmount: 100,
//         },
//         RedirectUrl: "http://www.eway.com.au",
//         TransactionType: "Purchase",
//         CurrencyCode: "AUD",
//       }
//     );
//     // Log the response and Customer object for debugging
//     console.log(response);

//     // Send a successful response with the Customer data
//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
