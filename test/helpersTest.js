/* eslint-disable linebreak-style */
const assert = require('chai').assert;

const  getUserByEmail  = require('../helper');

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
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@egoogle.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    //.equal(actual, expected, [message])
    assert.notEqual(user, expectedUserID);
  });
});