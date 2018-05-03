/**
 * Storygram APIs
 * @author Marcos Baez <baez@disi.unitn.it>
 */
var https = require("https");
var http = require("http");

exports.init = function (app) {

  //Postgres
  var pgp = require('pg-promise')();
  var connectionString = process.env.DATABASE_URL || 'francisco://localhost:5432/storytest';
  var db = pgp(connectionString);

  app.post('/api/login', function (req, res) {
    var cred = req.body;

    if (!cred.username || cred.username.trim().length === 0) {
      res.status(404).send();
      return;
    }

    fnGetUserData(cred.username, {
      success: function (user) {
        if (user.edge_owner_to_timeline_media.edges.length === 0) {
          res.status(404).send();
          return;
        }

        req.session.user = {
          username: cred.username
        };

        fnProcessUserData(req.session.user, user);

        //console.log(posts.items.length);
        res.send(req.session.user.profile);
      }, 
      error : function(){
        console.log("Login: problem with credentials");
      }
    });
  });


  app.get('/api/accounts/:id', function (req, res) {
    var id = req.params.id;

    if (id.trim().length === 0) {
      res.status(404).send();
      return;
    }

    var account = fnGetAccount(req.session.user, id);
    if (!account) {
      res.status(403).send();
      return;
    }
    res.send(account);

  });

  app.post('/api/stories', function (req, res) {
    var data = req.body;
    
    var photo = fnGetPhoto(req.session.user, data.photo.id);
    var account = fnGetAccount(req.session.user, data.from.id);
    
    var person = {
      id : account.id,
      username : account.username,
      full_name : account.full_name,
      profile_picture : account.profile_picture
    };
    
    var story = {
      id: 'S' + Math.round(Math.random() * 100) + '_' + photo.id, 
      photo: photo,
      story: data.story,
      from: person,
      created_time: Math.round(Date.now() / 1000),
      feedback: []
    };    
    
    account.stories.push(story);

    res.status(200).send();

  });

  app.post('/api/photos/:id/tags', function (req, res) {
    var id = req.params.id;
    var tags = req.body;

    var user = req.session.user;

    console.log(id);
    console.log(tags);

    var photo = fnGetPhoto(user, id);

    if (!photo) {
      res.status(404).send();
      return;
    }
    
    // update local tags
    photo.tags.place = tags.place ? tags.place : photo.tags.place;
    photo.tags.date = tags.date ? tags.date : photo.tags.date;
    photo.tags.people = tags.people ? tags.people : photo.tags.people;
    photo.tags.story = tags.story ? tags.story : photo.tags.story;

    //console.log(this.photo);

    var data = {
      username : user.username,
      user_id : user.profile.id,
      photo_url : photo.images.standard,
      photo_id : id,
      date : tags.date,
      place : tags.place,
      people : tags.people,
      story : tags.story
    };

    console.log(data);

    // we can check if all data is present and send only then
    // but will fail if users leave fields blank

    //format query (data: data to insert; columns: null, taken from data object; table name: photos)
    var query = pgp.helpers.insert(data, null, 'photos');

    //feed query into insert instruction
    /*db.none(query)
        .then(function() {
            // success;
            console.log('success');
            res.status(200).send();
        })
        .catch(function(error){
            // error;
            console.log('ERROR:'+error);
        });*/
    
    res.send(photo);

  });

  // legacy code
  app.get('/api/user/:id/photos', function (req, res) {
    var id = req.params.id;

    if (id.trim().length === 0) {
      res.status(404).send();
      return;
    }

    fnGetUserData(id, {
      success: function (user) {
        res.send(user);
      }
    });
  });

};

/**
 * Generates demo data from Instagram account
 */
var fnGetUserData = function (id, cb) {

  /*var options = {
    hostname: "www.instagram.com",
    path: "/{0}/".replace("{0}", id)
  };

  https.get(options, function (response) {
    var body = '';
    //body comes in chunks of data
    response.on('data', function (d) {
      body += d;
    });
    //when end event is fired, no more parts are missing
    response.on('end', function () {
      //get data from HTML
      var data = body.split("window._sharedData = ")[1].split(";</script>")[0];
      var parsed = JSON.parse(data);
      //get user part from JSON
      var user = parsed.entry_data.ProfilePage[0].graphql.user;
      cb.success(user);
    });

  }).on('error', function (e) {
    if (cb.error) cb.error(e);
  });*/


    var options = {
        host: 'http://happy.mateine.org',
        path: "design4all/storygram/{0}.json".replace("{0}", 'user1')
    };

    var url = options.host + "/" + options.path;

    http.get(url, function (response) {
        var body = '';
        //body comes in chunks of data
        response.on('data', function (d) {
            body += d;
        });
        //when end event is fired, no more parts are missing
        response.on('end', function () {
            //body will be user data directly
            var parsed = JSON.parse(body);
            cb.success(parsed);
        });

    }).on('error', function (e) {
      console.log('error here!!!');
        console.log(e);
        if (cb.error) cb.error(e);
    });

};


/**
 * Generates demo data from Instagram account
 */
var fnProcessUserData = function (user, data) {

  // accounts the user is managing
  user.accounts = [];
  user.profile = {};

  var person = {
    photos: [],
    stories: [],
    friends: [],
    feedback: []
  };

  // processing data
  //get posts from user data
  var posts = data.edge_owner_to_timeline_media.edges;
  posts.forEach(function (item,index) {
    var photo = {
      id: item.node.id,
      images: {
          thumbnail:item.node.thumbnail_src,
          standard:item.node.display_url
      },
      contributor: data,
      tags: {
        people: '',
        date: '',
        place: '',
        story: ''
      },
      stories: [],
      created_time: item.node.taken_at_timestamp,
      visibility: ''
    };
    person.photos.push(photo);

    var tempText = item.node.edge_media_to_caption.edges[0];

    var storyText = tempText ? tempText.node.text : '';

    if (Math.random() > 0.75) {
      photo.tags.story = storyText;
      var story = {
        id: 'S' + photo.id,
        photo: photo,
        story: storyText,
        from: data,
        created_time: item.node.taken_at_timestamp,
        feedback: []
      };
      person.stories.push(story);

      /*item.comments.data.forEach(function (c) {
        var feedback = {
          story: story,
          type: 'comment',
          data: c
        };
        person.feedback.push(feedback);
      });

      item.likes.data.forEach(function (l) {
        var feedback = {
          story: story,
          type: 'like',
          data: l
        };
        person.feedback.push(feedback);
      });*/
    }

  });

  // basic profile of the person
  var profile = data;
  person.id = data.id;
  person.username = data.username;
  person.full_name = data.full_name;
  person.profile_picture = data.profile_pic_url_hd;
  person.cover_picture = person.photos[Math.round((person.photos.length-1)* Math.random())].images.standard;

  // The user can manage more than one account
  user.accounts.push(person);

  // Profile of the user that manages the acounts
  user.profile = profile;
  user.profile.accounts = [{
    id : user.profile.id,
    username: user.profile.username,
    full_name: user.profile.full_name
  }];

};

var fnGetAccount = function (user, accountId) {
  if (! user || !user.accounts) return null;
  
  return user.accounts.find(function (person) {
    return person.id === accountId;
  });
};

var fnGetPhoto = function (user, photoId) {

  var photo = null;
  user.accounts.some(function (account) {

    photo = account.photos.find(function (photo) {
      return photo.id == photoId;
    });

    return photo !== undefined;
  });
  return photo;
};