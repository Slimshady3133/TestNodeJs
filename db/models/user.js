const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {}

    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  User.init(
    {
      login: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  User.beforeCreate(async (user) => {
    await user.hashPassword();
  });

  return User;
};
