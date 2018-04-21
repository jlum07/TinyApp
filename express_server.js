// Might need to rename to index.js?
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const bcrypt = require('bcrypt');

var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['quickbrownfox', 'thelazydog'],
  // Cookie Options
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day exipration
}))

var methodOverride = require('method-override');
app.use(methodOverride('_method'));


var urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "11111111",
    viewCount: [
      {uid: '11111111' , date: new Date(2018, 3, 19, 12, 30, 0, 0)},
      {uid: '22222222' , date: new Date(2018, 3, 14, 12, 30, 0, 0)}
    ],
    // viewUnique:
    createDate: new Date(2018, 3, 19, 12, 30, 0, 0)
  },
  "9sm5xK": {
    shortURL: "9sm5xK",
    longURL: "http://www.google.com",
    userID: "11111111",
    viewCount: [
      {uid: '11111111' , date: new Date(2018, 3, 19, 12, 30, 0, 0)}
    ],
    createDate: new Date(2018, 3, 12, 12, 30, 0, 0)
  },
  "d5GS3l": {
    shortURL: "d5GS3l",
    longURL: "http://www.facebook.com",
    userID: "22222222",
    viewCount: [
      {uid: '22222222' , date: new Date(2018, 3, 19, 12, 30, 0, 0)}
    ],
    createDate: new Date(2018, 3, 14, 12, 30, 0, 0)
  },
  "l4s03G": {
    shortURL: "l4s03G",
    longURL: "http://www.reddit.com",
    userID: "22222222",
    viewCount: [
      {uid: '22222222' , date: new Date(2018, 3, 19, 12, 30, 0, 0)}
    ],
    createDate: new Date(2018, 3, 6, 12, 30, 0, 0)
  },
  "k4g9YR": {
    shortURL: "k4g9YR",
    longURL: "http://www.youtube.com",
    userID: "22222222",
    viewCount: [
      {uid: '22222222' , date: new Date(2018, 3, 19, 12, 30, 0, 0)}
    ],
    createDate: new Date(2018, 3, 4, 12, 30, 0, 0)
  },
  "L5k03G": {
    shortURL: "L5k03G",
    longURL: "http://www.blogto.com",
    userID: "22222222",
    viewCount: [
      {uid: '22222222' , date: new Date(2018, 3, 19, 12, 30, 0, 0)}
    ],
    createDate: new Date(2018, 3, 23, 12, 30, 0, 0)
  }
};


const users = {
  "11111111": {
    id: "11111111",
    email: "a@b.com",
    hashedPassword: bcrypt.hashSync("bob", 10)
  },
  "22222222": {
    id: "22222222",
    email: "b@c.com",
    hashedPassword: bcrypt.hashSync("fish", 10)
  },
  "33333333": {
    id: "33333333",
    email: "c@d.com",
    hashedPassword: bcrypt.hashSync("dog", 10)
  }
}

// Only generates base36 string .. want base62
// function generateRandomString() {
//   // return Math.random().toString(36).replace('0.', '');
//   return Math.random().toString(36).substring(2,8);
// }

function generateRandomString(len) {
  var random = "";
  var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++) {
    random += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return random;
}

function getUserLinks(user, urlDB) {

  let userDB = {};

  for (key in urlDB) {
    if (user === urlDB[key].userID) {
      userDB[key] = urlDB[key];
    }
  }
  return userDB;
}

function checkVisitor(req) {
  if (!req.session.visitor_id) {
    req.session.visitor_id = generateRandomString(10);
  }
}

// Sends get request to to /urls
app.get("/", (req, res) => {
  checkVisitor(req);
  res.redirect("/urls");
});

// For debugging ULRdb
app.get("/urls.json", (req, res) => {
  checkVisitor(req);
  res.json(urlDatabase);
});

// For debugging Userdb
app.get("/users.json", (req, res) => {
  checkVisitor(req);
  res.json(users);
});

// For debugging user url db
app.get("/user/:uID.json", (req, res) => {
  checkVisitor();
  res.json(getUserLinks(req.params.uID, urlDatabase));
});

// Index/Main page
app.get("/urls", (req, res) => {
  checkVisitor(req);
  let templateVars = {
    user_id: req.session.user_id,
    urls: getUserLinks(req.session.user_id, urlDatabase)
  };
  res.render("urls_index", templateVars);
});

// Add new page
app.get("/urls/new", (req, res) => {
  checkVisitor(req);
  let templateVars = {
    user_id: req.session.user_id
   };

  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// Add new with post
app.post("/urls", (req, res) => {

  checkVisitor(req);
  let rand = generateRandomString(6);

  urlDatabase[rand] = {
    userID: req.session.user_id,
    shortURL: rand,
    longURL: req.body.long_URL,
    viewCount: [{}],
    createDate: new Date()
  }

  let templateVars = {
    user_id: req.session.user_id,
    urls: getUserLinks(req.session.user_id, urlDatabase)
  };

  res.render("urls_index", templateVars);
});

// Show page
app.get("/urls/:id", (req, res) => {
  checkVisitor(req);
  let templateVars = {
    user_id: req.session.user_id,
    short_URL: req.params.id,
    url: urlDatabase[req.params.id],
    users: users
  };
  res.render("urls_show", templateVars);
});

// Register
app.get("/register", (req, res) => {
  checkVisitor(req);
  let templateVars = {
    user_id: req.session.user_id,
  };

  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }
});

app.get("/login", (req, res) => {
  checkVisitor(req);
  let templateVars = {
    user_id: req.session.user_id,
  };
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_login", templateVars);
  }
});

// Delete
app.delete("/urls/:id/delete", (req, res) => {
  checkVisitor(req);
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


// Delete
// app.post("/urls/:id/delete", (req, res) => {
//   delete urlDatabase[req.params.id];
//   res.redirect("/urls");
// });

//// edit ... might be put.. put vs post
//// maybe not because of form needs post??
//// express/node method over ride to change to req method
// Update
app.post("/urls/:id", (req, res) => {
  checkVisitor(req);
  urlDatabase[req.params.id].longURL = req.body.long_URL;
  res.redirect("/urls");
});

// login
// user_id ..
app.post("/login", (req, res) => {
  checkVisitor(req);

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
      if (bcrypt.compareSync(pWord, users[key].hashedPassword)) {
        uID = key;
        break;
      } else {
        res.status(403).send('Password does not match.');
      }
    }
  }

  if (uID === undefined) {
    res.status(403).send('Email not found.');
  }

  req.session.user_id = uID;

  res.redirect("/urls");

});

// logout
app.post("/logout", (req, res) => {
  checkVisitor(req);
  req.session.user_id = null;
  res.redirect("/urls");
});

// Post Register
app.post("/register", (req, res) => {
  checkVisitor(req);

  let eMail = req.body.email;
  let pWord = req.body.password;

  const hPassword = bcrypt.hashSync(pWord, 10);

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

    let uID = generateRandomString(8);

    users[uID] = {
      id: uID,
      email: eMail,
      hashedPassword: hPassword
    }

    req.session.user_id = uID;
  }
  res.redirect("/urls");
});

// Redirect
app.get("/u/:short_URL", (req, res) => {
  checkVisitor(req);

  let long_URL;
  for (sURL in urlDatabase) {
    if (req.params.short_URL === sURL) {
      long_URL = urlDatabase[req.params.short_URL].longURL;
      if (req.session.user_id) {
        let tempView = {uid: req.session.user_id, date: new Date()};
        urlDatabase[req.params.short_URL].viewCount.push(tempView);
      } else {
        let tempView = {uid: req.session.visitor_id, date: new Date()};
        urlDatabase[req.params.short_URL].viewCount.push(tempView);
      }

      res.redirect(long_URL);
    }
  }
  if (long_URL === undefined) {
    res.status(404).send('Short URL not found.');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
