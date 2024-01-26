/* eslint-disable linebreak-style */
// Requires / Packages
const express = require("express");
// const cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
//// Set-up / Configrations
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(cookieSession({
  name:  'session',
  keys: ['tinyapp'],
}));
// Generates a random string of specified length using alphanumeric characters.👇🏽👇🏽👇🏽
const generateRandomString = function(number) {
  let aplphanumber = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for (let index = 0; index < number; index++) {
    result += aplphanumber.charAt(Math.floor(Math.random() * aplphanumber.length));
  }
  return result;
};
// urlDatabase[id]
// urlDatabase[id].longUrl
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// const urlDatabase = {
//   b6UTxQ: {
//     longURL: "https://www.tsn.ca",
//     userID: "aJ48lW",
//   },
//   i3BoGr: {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lW",
//   },
// };
const salt = bcrypt.genSaltSync(10);

const users = {
  abc: {
    id: "abc",
    email: "abc@gmail.com",
    password: bcrypt.hashSync('12345',salt),
  },
  bcd: {
    id: "bcd",
    email: "abc@example.com",
    password: bcrypt.hashSync('6789',salt)
  },
};
console.log(users);
// GET /login
app.get('/login', (req, res) => {
  res.render('login');
});

// POST /login
app.post('/login', (req, res) => {
  // pull the info off the body
  const email = req.body.email;
  const password = req.body.password;

  // did they NOT provide a email and password?
  if (!email || !password) {
    return res.status(400).send('Please provide a email and password');
  }

  // lookup the user based on their email
  let foundUser = null;

  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }

  // did we NOT find a user?
  if (!foundUser) {
    return res.status(400).send('no user with that email found');
  }

  // do the passwords NOT match
  const result = bcrypt.compareSync(password, foundUser.password);
  // (foundUser.password !== password)
  if (!result) {
    return res.status(400).send('passwords do not match');
  }

  // happy path!

  // set a cookie
  // res.cookie('userId', foundUser.id);
  req.session.userId = foundUser.id;

  // redirect the user somewhere
  res.redirect('/urls');
});
// GET /register
app.get('/register',(req,res)=>{
  res.render('register');
});
// post/register
app.post('/register',(req,res)=>{

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
  const userId = generateRandomString(3);
  const hash = bcrypt.hashSync(password, salt);

  const user = {
    id: userId,
    email: email,
    password: hash,
  };

  users[userId] = user;
  console.log(users);
  // res.cookie('userId',user.id);
  // res.cookie('userId', foundUser.id);
  // req.session.userId = foundUser.id;
  res.redirect('/urls');
});
//below
// Handle GET request for "/urls" endpoint, rendering the "urls_index" view
app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const templateVars = {
    user,
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});
// Handle GET request for "/urls/new" endpoint, rendering the "urls_new" view.
app.get("/urls/new",(req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  console.log(user);
  if (user) {
    const templateVars = {
      user,
      urls: urlDatabase
    };
    res.render("urls_new",templateVars);
   
  } else {
    res.redirect('/login');
  }
});

// Handle GET request for "/urls/:id" endpoint, rendering the "urls_show" view
app.get("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id],
    user};
  if (urlDatabase[req.params.id] === undefined) {
    res.status(404).send('<html><body><p>URL does not exist.</p></body></html>');
  }

  res.render("urls_show", templateVars);
  
});
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  console.log(urlDatabase);
  
  if (urlDatabase[id] === undefined) {
    res.send('<html><body><p>URL does not exist.</p></body></html>');
  }
  res.redirect(longURL);
});

/*handles a POST request to '/urls'.checks if the request body contains a valid 'longURL',
and if not, it sends an appropriate response.*/

app.post("/urls",(req, res) => {
  const id = generateRandomString(6);
  const userId = req.session.userId;
  const user = users[userId];
  if (!user) {
    res.status(401).send('<html><body><p>You must be logged in to shorten URLs.</p></body></html>');
  }

  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls`);
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
app.post('/logout', (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  console.log(user.id);
  // res.clearCookie(["userId"]);
  req.session = null;
  res.redirect('/login');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});