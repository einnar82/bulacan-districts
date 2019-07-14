const municipalities = require("./bulacan.json");
const express = require("express");
const app = express();
const cors = require("cors");
const apicache = require("apicache");
const cache = apicache.middleware;
const port = 3000;

app.use(cors());
app.use(cache("5 minutes"));

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "This is a test message!"
  });
});

app.get("/districts", (req, res) => {
  return res.json({
    success: true,
    payload: municipalities
  });
});

app.get("/districts/:id", (req, res) => {
  let filteredMunicipality = filterById(req);
  return res.json({
    success: true,
    payload: filteredMunicipality
  });
});

app.get("/municipalities", (req, res) => {
  return res.json({
    success: true,
    payload: allMunipalities()
  });
});

app.get("/municipalities/:name", (req, res) => {
  let searchViaName = municipalityName(req);
  return res.json({
    success: true,
    payload: searchViaName || {}
  });
});

app.listen(port, () => console.log(`This app listening on port ${port}!`));

const allMunipalities = () => {
  let [first, second, third, fourth, fifth] = municipalities.districts;
  let combinedMunicipalities = [
    ...first.municipalities,
    ...second.municipalities,
    ...third.municipalities,
    ...fourth.municipalities,
    ...fifth.municipalities
  ];
  return combinedMunicipalities;
};

const municipalityName = req => {
  let combinedMunicipalities = allMunipalities();
  let parsedString = req.params.name
    .replace(/\b\w/g, function(match) {
      return match.toUpperCase();
    })
    .split(" ")
    .toString();

  let transformedString = parsedString.replace(/-/g, " ");

  let searchViaName = combinedMunicipalities.find(
    combined => String(combined.name) === String(transformedString)
  );
  return searchViaName;
};

const filterById = req => {
  return municipalities.districts.filter(
    municipality => Number(municipality.id) === Number(req.params.id)
  );
};
