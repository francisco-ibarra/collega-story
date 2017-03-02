/* Photo grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var Models = require("./models");
var Vue = require("vue");


exports.Component = {

    template : "#photo-grid",

    data: function(){
      return {
        posts : []
      };
    },

    // methods of the component
    methods : {

      loadPosts : function (user){
        var self = this;
        Models.User.loadPosts(user, function(posts){
          self.posts = posts;
        });
      },
      goBack : function(){
        this.$router.push({name : 'home'});
      }
    },

    // we watch the changes to the components' data / events
    watch : {

      '$route' : function(to, from){
        this.loadPosts(this.$route.params.user)
      }
    },

    // events of the component lifecycle

    created : function(){
      this.loadPosts(this.$route.params.user);
    },

    updated : function(){
      // when the component is updated do...
    }
};
