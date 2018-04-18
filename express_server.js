// Might need to rename to index.js

var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


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

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let rand = generateRandomString();
  urlDatabase[rand] = req.body.longURL;
  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL);
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});