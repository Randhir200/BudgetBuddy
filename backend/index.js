require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

// Use Helmet to set various HTTP headers for security
app.use(helmet());

app.use("/", (req, res) => {
  res.send("this is home page");
});

app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is working in the port ${PORT}`);
});
