// Might need to rename to index.js?

var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());



var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// Only generates base36 string
// function generateRandomString() {
//   // return Math.random().toString(36).replace('0.', '');
//   return Math.random().toString(36).substring(2,8);
// }

function generateRandomString() {
  var random = "";
  var randLength = 6;
  var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < randLength; i++) {
    random += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return random;
}

// console.log(generateRandomString());

app.get("/", (req, res) => {
  res.end("Hello!");
});

// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// Index/Main page
app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Add new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    // urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// Add new with post
app.post("/urls", (req, res) => {
  let rand = generateRandomString();
  urlDatabase[rand] = req.body.longURL;
  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Show page
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

// Delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//// edit ... might be put.. put vs post
//// maybe not because of form needs post??
//// express/node method over ride to change to req method
// Update
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// login
app.post("/login", (req, res) => {
  let uName = req.body.username;
  res.cookie("username",uName);
  // let templateVars = {
  //   username: req.cookies["username"],
  //   urls: urlDatabase
  // };
  res.redirect("/urls");
});

// logout
app.post("/logout", (req, res) => {
  // let uName = req.body.username;
  res.clearCookie("username");
  // let templateVars = {
  //   username: req.cookies["username"],
  //   urls: urlDatabase
  // };
  // res.render("urls_index", templateVars);
  res.redirect("/urls");
});

// Redirect
app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL);
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});