"use strict";

var Mongoose = require('mongoose'),
  Moment = require('moment'),
  Schema = Mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var year = Moment().utc().year;

var song = new Schema({
  name: { type: String, required: true },
  album: { type: String },
  genre: { type: String },
  releasedOn: { type: Date, max: Moment().utc().toDate() },
  isExplicit: { type: Boolean, default: false },

  artist: { type: ObjectId, ref: 'Artist' },
  tags: [{ type: ObjectId, ref: 'Tag' }]
});

module.exports = Mongoose.model('Song', song);