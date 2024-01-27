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

module.exports = getUserByEmail;