const usersController = require("../controllers").user;

module.exports = app => {
  app.get("/users/:userId", usersController.show);
};
