const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      flash = require("connect-flash"),
      methodOverride = require("method-override"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local");
      
const User = require("./models/user");
      
const indexRoutes = require("./routes/index"),
      commentRoutes = require("./routes/comments"),
      campgroundRoutes = require ("./routes/campgrounds");

require('dotenv').config();
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public")); //dirname for more specificity/security
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0-whbwu.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority", {useNewUrlParser:true});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  //can be anything, used to generate session hash
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //got these methods from passportLocalMongoose, otherwise would have to write
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//whatever we put in res.locals is available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user; 
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ROUTING
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// SERVER INIT
let port = process.env.PORT;
app.listen(port, () => {
  console.log("YelpCamp listening on port " + port);
});