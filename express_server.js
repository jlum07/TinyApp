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



// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

var urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "111111"
  },
  "9sm5xK": {
    shortURL: "9sm5xK",
    longURL: "http://www.google.com",
    userID: "111111"
  },
  "d5GS3l": {
    shortURL: "d5GS3l",
    longURL: "http://www.facebook.com",
    userID: "222222"
  }
};


const users = {
  "111111": {
    id: "111111",
    email: "a@b.com",
    password: "bob"
  },
  "222222": {
    id: "222222",
    email: "b@c.com",
    password: "fish"
  },
  "333333": {
    id: "333333",
    email: "c@d.com",
    password: "dog"
  }
}


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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/cookie.json", (req, res) => {
  res.json(req.cookies);
});

// Index/Main page
app.get("/urls", (req, res) => {
  let templateVars = {
    ///////////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Add new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    ///////////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    // urls: urlDatabase
  };

  if (!req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {
    res.render("urls_new", templateVars);
  }


});

// Add new with post
app.post("/urls", (req, res) => {
  let rand = generateRandomString();
  urlDatabase[rand] = {
    userID: req.cookies["user_id"],
    shortURL: rand,
    longURL: req.body.long_URL
  }
  // urlDatabase[rand].userID = req.cookies["user_id"];
  // urlDatabase[rand].shortURL = rand;
  // urlDatabase[rand].longURL = req.body.long_URL;

  // console.log(req.cookies["user_id"]);
  // console.log(rand);
  // console.log(req.body.long_URL);


  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let templateVars = {
    /////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Show page
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    ////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    short_URL: req.params.id,
    url: urlDatabase[req.params.id]
    // short_URL: req.params.id,
    // long_URL: urlDatabase[req.params.id].longURL
  };
  res.render("urls_show", templateVars);
});

// Register
app.get("/register", (req, res) => {
  let templateVars = {
    ///////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    // urls: urlDatabase
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    //////////////////////////////////////////////////
    user_id: req.cookies["user_id"],
    // urls: urlDatabase
  };
  res.render("urls_login", templateVars);
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
  urlDatabase[req.params.id].longURL = req.body.long_URL;
  res.redirect("/urls");
});

// login
// user_id ..
app.post("/login", (req, res) => {

  let uID;
  let eMail = req.body.email;
  let pWord = req.body.password;

  if (eMail == '' && pWord == '') {
    res.status(400).send('You must enter both an email adress and password.');
  } else if (eMail == '') {
    res.status(400).send('You must enter an email address.');
  } else if (pWord == '') {
    res.status(400).send('You must enter a password.');
  }

  for (let key in users) {
    if (users[key].email == eMail) {
      if (users[key].password != pWord) {
        res.status(403).send('Password does not match.');
      } else {
        uID = key;
        break;
      }
    }
  }

  if (uID === undefined) {
    res.status(403).send('Email not found.');
  }

  res.cookie("user_id", uID);
  res.redirect("/urls");

});

// logout
app.post("/logout", (req, res) => {

  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Post Register
app.post("/register", (req, res) => {
  let eMail = req.body.email;
  let pWord = req.body.password;

  let error = false;

  if (eMail == '' || pWord == '') {
    error = true;
    res.status(400).send('You must enter both an Email and Password!!!');
  }

  for (let key in users) {
    if (users[key].email == eMail) {
      error = true;
      res.status(400).send('Email has already been registered!!!');
    }
  }

  if (error == false) {

    let uID = generateRandomString();

    users[uID] = {
      id: uID,
      email: eMail,
      password: pWord
    }

    res.cookie("user_id", uID);

  }


  res.redirect("/urls");
});

// Redirect
app.get("/u/:short_URL", (req, res) => {
  // console.log(req.params.shortURL);
  let long_URL = urlDatabase[req.params.short_URL].longURL;
  res.redirect(long_URL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
