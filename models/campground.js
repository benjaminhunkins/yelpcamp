const mongoose = require("mongoose");

// schema setup not how you'd actually do this
const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// pre hook to delete comments as well. this requires .remove() to be called rather than .findByIdAndRemove()
const Comment = require('./comment');
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
  	_id: {
    	$in: this.comments
	  }
	});
});

// compile the above into a model, does this define the collection? also set it as the return value for this module.
module.exports = mongoose.model("Campground", campgroundSchema);