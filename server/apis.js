/**
 * Storygram APIs
 * @author Marcos Baez <baez@disi.unitn.it>
 */
var https = require("https");

exports.init = function (app) {

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

};