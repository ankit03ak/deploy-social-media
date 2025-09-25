
// config/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: "depezajet",
  api_key: "392523432164632",
  api_secret: "eTOW7xnpI5ecRVoVsHCxFZGCOqM",
});

module.exports = cloudinary;

