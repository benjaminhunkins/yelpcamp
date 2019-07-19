const express = require("express"),
      router = express.Router(),
      passport = require("passport");

const User = require("../models/user");

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("landing");
});


// show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle signup logic
router.post("/register", (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// handle login logic, ft. middleware!
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
  }), (req, res) => {
});

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out.");
  res.redirect("/campgrounds");
});


module.exports = router;