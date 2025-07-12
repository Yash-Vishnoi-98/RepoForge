import express from "express";
import passport from "passport";

const router = express.Router();

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback

// no form submission that's why we are using the get method instead of normal post methods

// router.get("/github")
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
); // get the email and get the default info that the github provides

// router.get("/github/callback")

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login",
  }),
  // if it fails redirect to above link i.e. login page
  function (req, res) {
    // if successfully loged in redirect to homepage
    res.redirect(process.env.CLIENT_BASE_URL);
  }
);

// whether user is authenticated or not
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  } else {
    res.send({ user: null });
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.json({ message: "Logged out" });
  });
});

export default router;
