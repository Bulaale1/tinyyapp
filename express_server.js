/* eslint-disable linebreak-style */
const express = require("express"); // require the express library
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs"); //set ejs as a view engine

app.use(express.urlencoded({ extended: true }));// Middleware to parse incoming URL-encoded form data
//with extended option set to true.
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
  console.log(urlDatabase[idToDelete]);
  delete urlDatabase[idToDelete];
  
  
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});