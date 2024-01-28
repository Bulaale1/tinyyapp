/* eslint-disable linebreak-style */
const assert = require('chai').assert;
const { getUserByEmail} = require('../helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// const serverUrl = "http://localhost:8080";


const expect = chai.expect;

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined when an invalid email is provided', function() {
    const user = getUserByEmail("user@egoogle.com", testUsers);
    assert.isUndefined(user);
  });
});


describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "abc@example.com", password: "6789" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });
  it('should redirect GET /urls/new to /login with status code 302', () => {
    const agent = chai.request.agent("http://localhost:8080");
  
    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "abc@example.com", password: "6789" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/new").then((redirectRes) => {
          // Step 3: Expect the status code to be 302 and redirected to /login
          expect(redirectRes).to.redirect;
          expect(redirectRes).to.redirectTo('http://localhost:8080/login');
          expect(redirectRes).to.have.status(302);
        });
      });
  });
  it('should return status code 404 for GET /urls/NOTEXISTS', () => {
    const agent = chai.request.agent("http://localhost:8080");
  
    // Make a GET request to a non-existing resource
    return agent.get("/urls/NOTEXISTS").then((res) => {
      // Expect the status code to be 404
      expect(res).to.have.status(404);
    });
  });
  it('should return status code 403 for GET /urls/b2xVn2', () => {
    const agent = chai.request.agent("http://localhost:8080");
  
    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "abc@example.com", password: "6789" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((forbiddenRes) => {
          // Step 3: Expect the status code to be 403
          expect(forbiddenRes).to.have.status(403);
        });
      });
  });

});






