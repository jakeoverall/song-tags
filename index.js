var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var port = 8888;

var Artist = require('./lib/models/artist');
var Song = require('./lib/models/song');
var Tag = require('./lib/models/tag');

app.use(bodyParser());

// console.log('creating nelly')
// var nelly = new Artist({name: 'Nelly', bio: 'Nelly is and forever will be a pimp', birthday: '11-2-1974', websites: ['http://www.nelly.net', 'https://twitter.com/Nelly_Mo'], genres: ['hip hop', 'pop', 'R&B']});
// nelly.save()
// var rideWitMe = new Song({name: 'Ride wit me', album: 'Country Grammar', genre: 'pop', releasedOn: '4-1-2001', isExplicit: false})
// rideWitMe.save();	


// var Nelly = Artist.findOne({name: 'Nelly'}).exec(function(err, nelly){
// 		console.log(nelly)
// nelly.songs.push(rideWitMe);
// nelly.save();
// });

mongoose.connect('mongodb://localhost/myTunes');

var connection = mongoose.connection;
connection.once('open', function(){
	console.log('successfully connected to myTunes');
});


app.get('/artists', function(req, res){
	Artist.find().exec(function(err, artists){
		res.status(200).send(artists);
	});
});

app.post('/artists', function(req, res){
	console.log(req.body)
	if(req.body.artist){
		var newArtist = new Artist(req.body.artist);
		newArtist.save(function(err, result){
			if(err){
				res.status(400).send('Artist not saved try again')
			} else {
				Artist.find().exec(function(error, artists){
					if(!error){
						res.status(200).send(artists);		
					}
				});
			}
		});
	} else {
		res.status(400).send('Please define an artist');
	}
});

app.get('/artists/:artistId', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		res.status(200).send(artist)
	});		
});

app.get('/artists/:artistId/songs', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		res.status(200).send(artist)
	});		
});


app.post('/artists/:artistId/songs', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		var newSong = new Song(req.body.song);
		newSong.save(function(err, song){
			artist.songs.push(song);
			artist.save(function(err){
				if(!err){
					res.status(200).send(song.name + " successfully added to " +  artist.name);	
				} else {
					res.status(400).send(song.name + " was not added to " +  artist.name);	
				}
			});
			
		});
	});		
});


app.get('/song/:songId', function(req, res){
	Song.findOne({_id: req.params.songId}).populate('tags').exec(function(err, song){
		if(!err){
			res.status(200).send(song);
		} else {
			res.status(404).send('song not found');
		}
	});
})

app.post('/song/:songId/tags', function(req, res){
	Tag.findOneAndUpdate({ name: req.body.name}, req.body, {upsert: true}).exec(function(err, tag){
		Song.findOne({_id: req.params.songId}).populate('tags').exec(function(err, song){
			song.tags.push(tag);
			song.save(function(err, song){
				if(err){
					res.status(400).send(err)
				} else {
					res.status(200).send(tag.name + ' added to ' + song.name)
				}
			})
		})
	})
});


app.listen(port, function () {
	console.log('listening on port: ' + port);
});
