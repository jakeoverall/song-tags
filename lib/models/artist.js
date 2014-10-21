"use strict";

var mongoose = require('mongoose'),
	moment = require('moment'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var artist = new Schema({
	name: {type: String, required: true},
	bio: {type: String},
	birthday: {type: Date, max: moment().utc().toDate()},
	websites: [{type: String, required: true, unique: true, lowercase: true }],
	genres: [{type: String, unique: true}],
	songs: [{type: ObjectId, ref: 'Song'}]
});

module.exports = mongoose.model('Artist', artist);