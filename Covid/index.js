const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { count } = require("console");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //===== START OF COVID COUNTRY SCALE
  const url = "https://corona.lmao.ninja/v3/covid-19/countries#";

  https.get(url, "JSON", function (response) {
    var data;
    response.on("data", function (chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });

    response.on("end", function () {
      const countryData = JSON.parse(data);
      var countries = []; //extracted country names
      countryLength = Object.keys(countryData).length;

      for (var i = 0; i < countryLength; i++) {
        countries.push(countryData[i].country);
      }

      var inputCountry = req.body.countryName;
      var indexOfCountry = countries.indexOf(inputCountry);

      var total = countryData[indexOfCountry].cases;
      res.write(
        "The total number of cases in " + inputCountry + " is " + total + "."
      );
      res.send();
    });
  });
  //=====>END OF COVID COUNTRY SCALE
});

//=====>START OF COVID  WORLD SCALE
// const url = "https://corona.lmao.ninja/v3/covid-19/all";

// https.get(url, function (response) {
//   console.log(response.statusCode);

//   let chunks = [];

//   response
//     .on("data", function (data) {
//       chunks.push(data);
//     })
//     .on("end", function () {
//       let data = Buffer.concat(chunks);
//       const worldData = JSON.parse(data);
//       const todayCases = worldData.todayCases;
//       const activeCases = worldData.active;

//       res.write("The number of cases today are " + todayCases + ".\n");
//       res.write(`The overall number of active cases are ${activeCases}.`);
//       res.send();
//     });
// });
//=======>END OF COVID WORLD SCALE

// //   res.send("Server is up and running");

app.listen(4000, function () {
  console.log("Server is running on port 4000");
});
