/**
 * Storygram APIs
 * @author Marcos Baez <baez@disi.unitn.it>
 */
var https = require("https");

exports.init = function (app) {

    //Postgres
    var pgp = require('pg-promise')();
    var connectionString = process.env.DATABASE_URL || 'francisco://localhost:5432/storytest';
    var db = pgp(connectionString);

  app.get('/api/user/:id/photos', function (req, res) {
    var id = req.params.id;

    if (id.trim().length == 0) {
      res.status(404).send();
      return;
    }

    var options = {
      hostname: "www.instagram.com",
      path: "/{0}/media/".replace("{0}", id)
    };

    https.get(options, function(response){
      var body = '';
      response.on('data', function (d) {
        body += d;
      });
      response.on('end', function () {
        var parsed = JSON.parse(body);
        res.send(parsed);
      });

    });

  });

    app.post('/api/user/:id/info', function(req,res){
      var body = req.body;

      //Table Structure as reference
      //CREATE TABLE answers ( id serial primary key, username varchar(35) NOT NULL, url text NOT NULL, when_notes text, where_notes text, who_notes text, knows_when boolean, knows_where boolean, knows_who boolean, what text);

      //Column and table names
      var columns = new pgp.helpers.ColumnSet(
          ['username','url','when_notes','where_notes','who_notes','knows_when','knows_where','knows_who','what'],
          {table: 'answers'}
      );
      console.log('post done');

      //Array with insert values
      var values = [];
      //Iterate body of request
      body.forEach(function(element){
          //initialize post information
          var post = {
              username : element.user,
              url : element.url,
              when_notes : element.whenNotes,
              where_notes : element.whereNotes,
              who_notes : element.whoNotes,
              knows_when : element.whenKnown,
              knows_where : element.whereKnown,
              knows_who : element.whoKnown,
              what : element.story
          };
          //load post array for slideshow
          values.push(post);
      });

      // generating a multi-row insert query:
      // INSERT INTO "answers"(<columns>) VALUES <values>
      var query = pgp.helpers.insert(values, columns);

      //feed query into insert instruction
      db.none(query)
      .then(function() {
            // success;
          console.log('success');
          res.status(200).send();
        })
        .catch(function(error){
            // error;
            console.log('ERROR:'+error);
        });
  });

};