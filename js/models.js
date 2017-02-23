var Story = {};

Story.api = {

    loadPosts: function(user, callback) {
        axios.get("./{user}.json".replace("{user}", user))
        .then( response => callback(response.data));
    }

};
