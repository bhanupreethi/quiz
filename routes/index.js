const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "mysql",
});

// Database connection
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to the database");
});

// Registration page
router.get("/register", (req, res) => {
  res.render("registration");
});

// Handle registration form submission
router.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  // Insert user data into the database
  const sql =
    "INSERT INTO users (username, password, emailid) VALUES (?, ?, ?)";
  connection.query(sql, [username, password, email], (err, results) => {
    if (err) {
      console.error("Error inserting data: " + err);
      return;
    }
    // Redirect to the home page after registration
    res.redirect("/home");
  });
});

// login page
router.get("/login", (req, res) => {
  res.render("login");
});

// handle quiz submit post
router.post("/submitQuiz", async (req, res) => {
  const { email, timer, username, mcq } = req.body;
  // Here considering option1 as correct answer, if user selected same, it will go inside, otherwise displaying pop up with message.
  if (mcq === "option1") {
    // first we are checking do we received 10 submissions yet or not.
    // if we received 10 already not storing in db, returning pop up message
    const checkCount = "SELECT count(*) as count FROM quizresults";
    connection.query(checkCount, (err, results) => {
      if (err) {
        console.error("Error checking at quiz count" + err);
        return;
      }

      if (results[0].count === 10) {
        res.send("Better luch next time");
      } else {
        //   Check if the user has submitted before using their email address
        const checkSubmissionQuery =
          "SELECT * FROM quizresults WHERE emailid = ?";
        connection.query(checkSubmissionQuery, [email], (err, results) => {
          if (err) {
            console.error("Error checking user submission: " + err);
            return;
          }

          if (results.length > 0) {
            // User has already submitted the quiz
            const responseMessage = "You have already submitted the quiz.";
            return res.json({ success: false, message: responseMessage });
          } else {
            // Insert the quiz results and timer data into the quizresults table
            const insertQuizResultsQuery =
              "INSERT INTO quizresults (username, responsetime, emailid) VALUES (?, ?, ?)";
            connection.query(
              insertQuizResultsQuery,
              [username, timer, email],
              (err, results) => {
                if (err) {
                  const responseMessage = "Error inserting quiz results: ";
                  return res.json({ success: false, message: responseMessage });
                }
              }
            );

            if (results) {
              // fetching all the quiz submitted user details from db
              const checkCount =
                "SELECT username, responsetime as time FROM quizresults";
              connection.query(checkCount, (err, results) => {
                if (err) {
                  const responseMessage =
                    "Error at feching all quiz users data";
                  return res.json({ success: false, message: responseMessage });
                }

                if (results) {
                  // sorting all based on time(ASC).
                  results.sort(
                    (item1, item2) => Number(item1.time) - Number(item2.time)
                  );
                  return res.json({ success: true, message: results });
                }
              });
            }
          }
        });
      }
    });
  } else {
    // if user selects wrong answer
    const responseMessage = "Wrong answer, try again";
    return res.json({ success: false, message: responseMessage });
  }
});

// Handle login form submission
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Check if the username exists in the database
  const checkUserQuery =
    "SELECT emailid, password, username FROM users WHERE emailid = ?";
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking user: " + err);
      return;
    }

    // If no matching user found, show an alert
    if (results.length === 0) {
      res.send('<script>alert("User not found. Please register.")</script>');
    } else {
      req.session.emailid = email;
      req.session.username = results[0].username;
      console.log(
        "password",
        results[0].password,
        password,
        results[0].username,
        email
      );

      if (results[0].password === password) {
        // Redirect to the home page after successful login
        res.redirect("/home");
      } else {
        // Password does not match, show an alert
        res.send('<script>alert("Incorrect password.")</script>');
      }
    }
  });
});

// Home page
router.get("/home", (req, res) => {
  // Once user sign in/up, storing the username and email in session.
  const username = req.session.username;
  const emailid = req.session.emailid;

  // Use the username for whatever you need in your route
  res.render("home", { username, emailid });
});

module.exports = router;
