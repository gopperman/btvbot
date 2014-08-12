var Twit = require('twit')
var request = require('request');
var htmlencode = require('htmlencode');
var T = new Twit(require('./config.js'))


function tweet() {
  //build a tweet
  // myTweet = 'Always Be Breeding';


  request({'json':true,'uri':'http://breedtv.com/api/random/'}, function (error, response, body) {

  if (!error && response.statusCode == 200) {
    video = body[0];
    console.log(video);

    myTweet = htmlencode.htmlDecode(video.title) + ': http://breedtv.com/'+ video.slug;
    console.log(myTweet); 

  }


//  tweet it
  T.post('statuses/update', { status: myTweet }, function(err, reply) {
          if (err) {
            console.log('error:', err);
          }
          else {
            // console.log('reply:', reply);
          }
  });

})

}

//tweet once when the script starts
tweet()

//every 4 hours, tweet again
setInterval(function () {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, 1000 * 60 * 60 * 5);
