/**
 * Storygram APIs
 * @author Marcos Baez <baez@disi.unitn.it>
 */
var https = require("https");

exports.init = function (app) {

  app.post('/api/login', function (req, res) {
    var cred = req.body;

    if (!cred.username || cred.username.trim().length === 0) {
      res.status(404).send();
      return;
    }

    fnLoadPosts(cred.username, {
      success: function (posts) {
        if (posts.items.length === 0) {
          res.status(404).send();
          return;
        }

        req.session.user = {
          username: cred.username
        };

        fnProcessPosts(req.session.user, posts);

        console.log(posts.items.length);
        res.send(req.session.user.profile);
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
    res.send(account);

  });

  // legacy code
  app.get('/api/user/:id/photos', function (req, res) {
    var id = req.params.id;

    if (id.trim().length === 0) {
      res.status(404).send();
      return;
    }

    fnLoadPosts(id, {
      success: function (posts) {
        res.send(posts);
      }
    });


  });

};

var fnLoadPosts = function (id, cb) {

  var options = {
    hostname: "www.instagram.com",
    path: "/{0}/media/".replace("{0}", id)
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var parsed = JSON.parse(body);
      cb.success(parsed);
    });

  }).on('error', function (e) {
    if (cb.error) cb.error(e);
  });
};

var fnProcessPosts = function (user, posts) {

  // accounts the user is managing
  user.accounts = [];
  user.profile = {};

  var person = {
    id: user.username,
    photos: [],
    stories: [],
    friends: [],
    feedback: []
  };

  // processing posts
  posts.items.forEach(function (item) {
    var photo = {
      images: {
        thumbnail: item.images.thumbnail.url,
        standard: item.images.standard_resolution.url
      },
      contributor: item.user,
      tags: {
        people: [],
        date: '',
        place: item.location
      },
      stories: [],
      created_time: item.created_time,
      visibility: ''
    };
    person.photos.push(photo);

    if (Math.random() > 0.75) {
      var story = {
        photo: photo,
        story: item.caption.text,
        from: item.caption.from,
        created_time: item.caption.created_time,
        feedback: []
      };
      person.stories.push(story);

      item.comments.data.forEach(function (c) {
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
      });
    }

  });


  // The user can manage more than one account
  user.accounts.push(person);

  // Profile of the user that manages the acounts
  user.profile = person.photos[0].contributor;
  user.profile.accounts = [{
    username: user.profile.username,
    full_name: user.profile.full_name
  }];

};

var fnGetAccount = function (user, accountId) {
  return user.accounts.find(function (person) {
    return person.id === accountId;
  });
};