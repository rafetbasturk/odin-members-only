const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: { type: String, required: true },
  post: { type: String, required: true },
  authorInfo: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// Virtual for book's URL
PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

PostSchema.virtual("datetime").get(function () {
  const date = DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  const time = DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)
  return `${date} - ${time}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);