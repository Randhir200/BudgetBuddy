require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const masterRoute = require("./routes/masterRoute");
const app = express();

//cors
app.use(cors());

// Use Helmet to set various HTTP headers for security
app.use(helmet());

app.use(masterRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is working in the port ${PORT}`);
});
