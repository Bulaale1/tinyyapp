/* eslint-disable linebreak-style */
const getUserByEmail = function(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null; // Return null if no user is found with the specified email
};

// Example usage:
// const usersDatabase = {
//   'user1': { id: 'user1', email: 'user1@example.com', password: 'password123' },
//   'user2': { id: 'user2', email: 'user2@example.com', password: 'secret456' },
// };

// const userEmailToLookup = 'user11@example.com';
// const foundUser = getUserByEmail(userEmailToLookup, usersDatabase);

// if (foundUser) {
//   console.log('User found:', foundUser);
// } else {
//   console.log('User not found for email:', userEmailToLookup);
// }
module.exports = getUserByEmail;