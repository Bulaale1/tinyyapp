/* eslint-disable linebreak-style */
// Requires / Packages
const express = require("express");
let cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const { getUserByEmail, generateRandomString } = require('./helpers');

//// Set-up / Configrations
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name:  'session',
  keys: ['tinyapp'],
}));

const urlsForUser = function(id) {
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};
//Url database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
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
  res.render('login', { user: null });
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
  let foundUser = getUserByEmail(email,users);

  // did we NOT find a user?
  if (!foundUser) {
    return res.status(400).send('no user with that email found');
  }

  // do the passwords NOT match
  const result = bcrypt.compareSync(password, foundUser.password);

  if (!result) {
    return res.status(400).send('passwords do not match');
  }

  // set a cookie using cookie-session package
  req.session.userId = foundUser.id;

  // redirect the user somewhere
  res.redirect('/urls');
});
// GET /register
app.get('/register',(req,res)=>{

  res.render('register', { user: null });
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
  let foundUser = getUserByEmail(email,users);

  // did we find a user
  if (foundUser) {
    return res.status(400).send('a user with that email already exists');
  }

  // create a new user object email is unique!
  const userId = generateRandomString(3);

  const hash = bcrypt.hashSync(password, salt);

  const user = {
    id: userId,
    email: email,
    password: hash,
  };

  users[userId] = user;
  console.log(users);
 
  // set a cookie using cookie-session package
  req.session.userId = user.id;

  res.redirect('/urls');
});
// Handle GET request for "/urls" endpoint, rendering the "urls_index" view
app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  let userURLS =  urlsForUser(userId);
  const user = users[userId];
  const templateVars = {
    user,
    urls: userURLS,
  };
  res.render("urls_index", templateVars);
});
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
// Handle GET request for "/urls/new" endpoint, rendering the "urls_new" view.
app.get("/urls/new",(req, res) => {
  const userId = req.session.userId;

  const user = users[userId];

  if (!user) {
    res.status(302).redirect('/login');
    return;
  }
  const templateVars = {
    user,
    urls: urlDatabase
  };
  res.render("urls_new",templateVars);
});

// Handle GET request for "/urls/:id" endpoint, rendering the "urls_show" view
app.get("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const id = req.params.id;
  if (urlDatabase[id] === undefined) {
    res.status(403).send('<html><body><p>URL does not exist .</p></body></html>');
    return;
  }
  if (userId !== urlDatabase[id].userID) {
    res.send('You don\'t have access for this urls');
  }

  const templateVars = { id: req.params.id, longURL: urlDatabase[id].longURL,
    user};

  res.render("urls_show", templateVars);
  
});
// redirect any user with short url to its relevent long url
app.get("/u/:id", (req, res) => {
  const id = req.params.id;

  const longURL = urlDatabase[id].longURL;
  
  if (urlDatabase[id] === undefined) {

    res.status(403).send('URL does not exist.');
  }
  res.redirect(longURL);
});

/*if user is not logged in, send them an appropriate message else let them shorten their urls and redirect them to 
 /urls/${ id}*/

app.post("/urls",(req, res) => {

  const userId = req.session.userId;

  const user = users[userId];
  //check if the user is logged in
  if (!user) {
    res.status(401).send('You must logged in to shorten URLs.');
  }
  const id = generateRandomString(6);
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID : userId,
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${ id}`);
});
//Delete function
app.post("/urls/:id/delete",(req,res)=>{
  const userId = req.session.userId;
  const id = req.params.id;
  const idToDelete = req.params.id;

  if (urlDatabase[idToDelete] === undefined) {

    res.status(404).send('URL does not exist.');
  }
  //check if the user is the owner of that link before deleting it
  if (userId !== urlDatabase[id].userID) {
    res.send('You don\'t have permission to perform this action');
  }
  delete urlDatabase[idToDelete];

  res.redirect("/urls");

});
//post for Editing existing Url
app.post("/urls/:id",(req, res) => {
  const userId = req.session.userId;
  const idToUpdate = req.params.id;
  //check if the user is the owner of that link before editing it
  if (userId !== urlDatabase[idToUpdate].userID) {
    res.send('You don\'t have permission to perform this action');
  }
  urlDatabase[idToUpdate].longURL = req.body.newURL;

  res.redirect('/urls');
});
//if user logout,delete the cookies and  redirect to login page
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
