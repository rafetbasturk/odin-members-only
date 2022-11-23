const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true },
  hash: { type: String },
  salt: { type: String },
  membershipStatus: {type: String, default: ""},
  admin: {type: Boolean, default: false}
}, { timestamps: true });

UserSchema.virtual("id").get(function () {
  return this._id;
});

UserSchema.virtual("initials").get(function () {
  return this.fname.charAt(0) + this.lname.charAt(0) ;
});

UserSchema.virtual("datetime").get(function () {
  const date = DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
  const time = DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.TIME_24_SIMPLE)
  return `${date} - ${time}`;
});

module.exports = mongoose.model("User", UserSchema);