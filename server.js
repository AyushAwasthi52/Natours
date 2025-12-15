const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("unhandledRejection", (err) => {
  console.log("Error Exiting Code!!!");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Error Exiting Code");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
