const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../models/tourModel");
dotenv.config({ path: `${__dirname}/../config.env` });

const Tours = fs.readFileSync(`${__dirname}/data/tours-simple.json`, "utf-8");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

const importData = async () => {
  try {
    await Tour.create(JSON.parse(Tours));
    console.log("Data created Successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};


if (process.argv[2] === "--import") {
    importData();
}

if (process.argv[2] === "--delete") {
    deleteData();
}