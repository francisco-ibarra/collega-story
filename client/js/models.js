var axios = require("axios");

var User = {

    loadPosts: function(id, callback) {
        axios.get("/api/user/{0}/photos".replace("{0}", id))
        .then(function(response){
           callback.success(response.data.items);
        })
        .catch(function(error){
            callback.error && callback.error(error);

        });
    },

    SavePostInfo: function(id,info,callback){
        axios.post("/api/user/{0}/info".replace("{0}", id),info)
        .then(function(response){
            console.log(response.status < 300 );
            callback.success(response)
        })
        .catch(function(error){
            console.log(error);
        });
    }

};

exports.User = User;
