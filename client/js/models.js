var axios = require("axios")

var User = {

    loadPosts: function(user, callback) {
        axios.get("./{user}.json".replace("{user}", user))
        .then(function(response){
           callback(response.data)
        });
    }

};

exports.User = User;
