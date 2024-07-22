const { checkForDuplicateEmail } = require("../middleware/signup");
const authController = require("../controllers").auth;
const { authJwt } = require("../middleware");

module.exports = app => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/signup", [checkForDuplicateEmail], authController.signup);
  app.post("/signinnonmed", authController.signinnonmed);
  app.post("/signinmed", authController.signinmed);
  app.get("/verify-email", authController.verifyEmail);
  app.post("/setup-2fa", [authJwt.verifyToken], authController.setup2FA);
  app.post("/verify-2fa", [authJwt.verifyToken], authController.verify2FA);
};
