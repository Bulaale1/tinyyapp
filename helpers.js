/* eslint-disable linebreak-style */
const getUserByEmail = function(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return undefined; // Return undefined if no user is found with the specified email
};

const generateRandomString = function(number) {
  let aplphanumber = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for (let index = 0; index < number; index++) {
    result += aplphanumber.charAt(Math.floor(Math.random() * aplphanumber.length));
  }
  return result;
};


module.exports = {getUserByEmail,generateRandomString};