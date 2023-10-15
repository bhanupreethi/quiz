const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: 10000,
    parameterLimit: 6,
  })
);

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key", // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Import your routes
const routes = require("./routes/index");
app.use("/", routes);

app.listen(3002, () => {
  console.log("Server is running on http://localhost:3002");
});
