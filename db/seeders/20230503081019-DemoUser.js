const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = {
  up: async () => {
    const users = [];

    // Create 5 users with random login, email, and password
    for (let i = 1; i <= 5; i += 1) {
      const login = `user${i}`;
      const email = `user${i}@example.com`;
      const password = `password${i}`;

      users.push({
        login,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Hash passwords in parallel
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    // Insert users into the database
    await User.bulkCreate(hashedUsers);
  },

  down: async () => {
    await User.destroy({ where: {} });
  },
};
