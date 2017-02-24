var axios = require("axios")

var User = {

    loadPosts: function(id, callback) {
        axios.get("/api/user/{0}/photos".replace("{0}", id))
        .then(function(response){
           callback(response.data.items)
        });
    }

};

exports.User = User;
