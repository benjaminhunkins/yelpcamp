const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String //included this because we'd have to look it up every time otherwise
  }
});

module.exports = mongoose.model("Comment", commentSchema);