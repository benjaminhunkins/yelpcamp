const express = require("express"),
      router = express.Router();

const middleware = require("../middleware");

const Campground = require("../models/campground");

// INDEX CAMPGROUNDS
router.get("/", (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// CREATE CAMPGROUND
router.post("/", middleware.isLoggedIn, (req, res) => {
  // get data from form on new
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  // make data into object
  let newCampground = {name: name, price: price, image: image, description: desc, author: author};
  // create new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW CAMPGROUND
router.get("/:id", (req, res) => {
  // find campground with provided id, populate it with actual comments
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err || !foundCampground) { //patch for mongo returning null
      console.log(err);
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err){
        res.redirect("/campgrounds");
      } else {
          res.render("campgrounds/edit", {campground: foundCampground});
      }
    });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
  //find and update correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err){
      res.redirect("/campgrounds");
    } else {
      foundCampground.remove(); //deprecated, use deleteMany
      req.flash("success", "Campground deleted.");
      res.redirect("/campgrounds");
    }
  });
});


module.exports = router;