const Campground = require("../models/campground"),
      Comment = require("../models/comment");

// MIDDLEWARE
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You must be logged in to do that.");
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err || !foundCampground){ // patch for mongo returning null
        req.flash("error", "Campground not found.");
        res.redirect("/campgrounds");
      } else {
        // does user own campground?
        if(foundCampground.author.id.equals(req.user._id)) { // use .equals because one is a string, one an object
           next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err || !foundComment){
        req.flash("error", "Comment not found.");
        res.redirect("back");
      } else {
        // does user own comment?
        if(foundComment.author.id.equals(req.user._id)) { // use .equals because one is a string, one an object
           next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  }
};


module.exports = middlewareObj;