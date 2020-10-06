const bcrypt = require("bcrypt");

module.exports = {
  checkPassword: (password, userPassword) => {
    return bcrypt.compare(password, userPassword);
  },
};
