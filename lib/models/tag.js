"use strict";

var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;


var tag = new Schema({
  name: { type: String, unique: true, required: true },
  songs: [{ type: ObjectId, ref: 'Song' }]
});

module.exports = Mongoose.model('Tag', tag);