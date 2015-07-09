var Twit = require('twit')
var request = require('request');
var htmlencode = require('htmlencode');
var T = new Twit(require('./config.js'))

//facebook stuff
var FB = require('fb');
FB.setAccessToken('CAAMH7pbcdooBALq0AadKggol1LyYwtThp3q7vZCy8fLZBPZBdxWkr6ahsvzuRkN4vuZCfbX6FSGwtVTlPnUNY4t5XMqYmu7m7K89UGaSI0xwJDXdra5DVjnCqE84zxieyYoF0QV2jkf3re0bJa9ipFcJ7guo4Y6WrIVrb3ZBvZASAJzltPI9a5XeITknKIBXwZD');

String.prototype.killWhiteSpace = function() {
    return this.replace(/\s/g, '');
};

String.prototype.killQuotes = function() {
    return this.replace(/\\"/g, '').replace(/\\'/g, '');
};


function tweet() {
  //build a tweet
  // myTweet = 'Always Be Breeding';


  request({'json':true,'uri':'http://breedtv.com/api/random/'}, function (error, response, body) {

  if (!error && response.statusCode == 200) {
    video = body[0];
    console.log(video);

    // myTweet = htmlencode.htmlDecode(video.title) + ': http://breedtv.com/'+ video.slug;
    var videoLink = '';

    myTweet = htmlencode.htmlDecode(video.title) + ' '; //First add the title of the video
    myFbMsg = myTweet; //set facebook msg to title of video

    //make different links, depending on whether it's youtube or vimeo
    if (video.src == 'youtube') {
      videoLink = 'https://www.youtube.com/watch?v='+ video.id;
    } else if (video.src == 'vimeo') {
      videoLink = 'https://vimeo.com/'+ video.id;
    }
    myTweet += videoLink; //add video link to tweet


    var i = video.tags.length;

    while (i--) {
      var hashtag = '#' + video.tags[i].name.killWhiteSpace().killQuotes();

      console.log(hashtag);


      if ((myTweet.length + hashtag.length) < 140) { //less than because we need one more character for a space before the #hashtag
        myTweet += ' ' + hashtag;
        myFbMsg += ' ' + hashtag;
      } else {
        myFbMsg += ' ' + hashtag;
      }
    };


    console.log(myTweet);
    console.log(myFbMsg);

  }


  // tweet it
  T.post('statuses/update', { status: myTweet }, function(err, reply) {
          if (err) {
            console.log('error:', err);
          }
          else {
            // console.log('reply:', reply);
          }
  });


  //post to facebook

  FB.api('/803447273028614/feed', 'post', { message: myFbMsg, link : videoLink}, function (res) {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
  });




})

}

// tweet once when the script starts
tweet()

// every 4 hours, tweet again
setInterval(function () {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, 1000 * 60 * 60 * 5);
