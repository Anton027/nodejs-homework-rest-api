const mongoose = require('mongoose');
require('dotenv').config();
const { HOST_DB,PORT } = process.env;
const { app } = require('./app');

async function main() {
  if (!HOST_DB) {
    throw new Error("HOST_DB not set!");
  }
  
  try {
    await mongoose.connect(HOST_DB);
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    })
  } catch (error) {
    console.error("Error: ", error.message);
    process.exit(1);
  }
}
main();

