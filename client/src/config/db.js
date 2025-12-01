// /config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 127.0.0.1 is safer than 'localhost' on some Macs due to IPV6 issues
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/picklepal");

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
