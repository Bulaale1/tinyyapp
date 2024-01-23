/* eslint-disable linebreak-style */
const express = require("express"); // require the express library
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs"); //set ejs as a view engine

app.use(express.urlencoded({ extended: true }));// Middleware to parse incoming URL-encoded form data 
//with extended option set to true.
// Generates a random string of specified length using alphanumeric characters.👇🏽👇🏽👇🏽
const generateRandomString = function(number) {
  let aplphanumber = 'abcdefghijklmnopkrstuvdxwz1234567890';
  let result = '';
  for (let index = 0; index < number; index++) {
    result += aplphanumber.charAt(Math.floor(Math.random() * aplphanumber.length));
    //const userId = Math.random().toString(36).substring(2,15);
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// Handle GET request for "/urls" endpoint, rendering the "urls_index" view
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// Handle GET request for "/urls/new" endpoint, rendering the "urls_new" view.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// Handle GET request for "/urls/:id" endpoint, rendering the "urls_show" view
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
  res.redirect('/u/:id');
  
});
app.get("/u/:id", (req, res) => {
  const longURL = req.body.longURL;
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString(6);
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});