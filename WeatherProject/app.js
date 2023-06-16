const express = require("express");
const bodyParser = require("body-parser");
const https = require("node:https");
const { log } = require("node:console");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);
  const apiKey = "1bad02514bfd0bedfe0989d14a30c96f";
  const query = req.body.cityName;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      // const object = {
      //     name: 'Ari Sandy',
      //     favoriteFood: "Sampe"
      // }
      // const objects = JSON.stringify(object);
      // console.log(objects);

      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(
        `<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`
      );

      res.write("<p>The weather is currently " + weatherDescription + ".</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
