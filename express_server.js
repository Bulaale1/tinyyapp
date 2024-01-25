/* eslint-disable linebreak-style */
// Requires / Packages
const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//// Set-up / Configrations
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
// Generates a random string of specified length using alphanumeric characters.👇🏽👇🏽👇🏽
const generateRandomString = function(number) {
  let aplphanumber = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for (let index = 0; index < number; index++) {
    result += aplphanumber.charAt(Math.floor(Math.random() * aplphanumber.length));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  abc: {
    id: "abc",
    email: "abc@gmail.com",
    password: "12345",
  },
  bcd: {
    id: "cde",
    email: "abc@example.com",
    password: "6789",
  },
};
// GET /register
app.get('/register',(req,res)=>{
  res.render('register');
});
// GET /register
app.post('/register',(req,res)=>{
  const userId = generateRandomString(3);
  const email = req.body.email;
  const password = req.body.password;

  // did they NOT provide a email and password?
  if (!email || !password) {
    return res.status(400).send('Please provide a email and password');
  }

  // look for a user with the provided email
  let foundUser = null;

  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }

  // did we find a user
  if (foundUser) {
    return res.status(400).send('a user with that email already exists');
  }

  // the email is unique!

  // create a new user object
  // const id = Math.random().toString(36).substring(2, 5);

  const user = {
    id: userId,
    email: email,
    password: password,
  };

  users[userId] = user;

  console.log(users);
  res.cookie('userId',user.id);
  res.redirect('/urls');
});


// Handle GET request for "/urls/new" endpoint, rendering the "urls_new" view.
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId];
  console.log(user);
  const templateVars = {
    user,
    // email: req.cookies["email"]
  };
  res.render("urls_new",templateVars);
});
// Handle GET request for "/urls/:id" endpoint, rendering the "urls_show" view
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id],
    user};
  res.render("urls_show", templateVars);
  
});
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  res.redirect(longURL);
});
// handles a POST request to '/urls'.checks if the request body contains a valid 'longURL',
// and if not, it sends an appropriate response.
app.post("/urls", (req, res) => {
  const id = generateRandomString(6);
  if (req.body.longURL === undefined) {
    res.send('please Enter url');
  } else if (req.body.longURL === ' ') {
    res.send('Empty link is not acceptable');
  }
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`);
});
//Delete function
app.post("/urls/:id/delete",(req,res)=>{
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete];
  res.redirect("/urls");
});
//post for Editing existing Url
app.post("/urls/:id",(req, res) => {
  const idToUpdate = req.params.id;
  urlDatabase[idToUpdate] = req.body.newURL;
  res.redirect('/urls');
});
// POST endpoint to handle login form submission

app.post('/login', (req, res) => {
  // const email = req.body.email; // get email from req.body.email
  const userId = req.cookies["userId"];
  const user = users[userId];
  console.log(user[userId]);
  res.cookie('email', user[userId]);
  res.redirect('/urls');
});
app.post('/logout', (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId];
  console.log(user);
  res.clearCookie(["userId"]);
  res.redirect('/urls');
});

// Handle GET request for "/urls" endpoint, rendering the "urls_index" view
app.get("/urls", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render("urls_index", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});