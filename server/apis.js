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

      var sqlData = [body.user,body.url,body.whenNotes,body.whereNotes,body.whoNotes,body.whenKnown,body.whereKnown,body.whoKnown,body.story];
      //console.log(sqlData);
        db.none("insert into answers(username,url,when_notes,where_notes,who_notes,knows_when,knows_where,knows_who,what) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", sqlData)
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