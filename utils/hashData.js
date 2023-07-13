const bcrypt = require("bcryptjs");

module.exports = async function (data) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
};
