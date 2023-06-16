const express = require("express");
const bodyParser = require("body-parser");
const https = require("node:https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Setting up MailChimp
mailchimp.setConfig({
  apiKey: "96cd3c8d6233e1d372a30f90c64e6f35-us21",
  server: "us21",
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = "c7f50443cc";
  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
  //Running the function and catching the errors (if any)
  // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

// API Key
// 96cd3c8d6233e1d372a30f90c64e6f35-us21
// List ID
// c7f50443cc
