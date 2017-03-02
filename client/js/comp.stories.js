/* Story grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var moment = require("moment");

exports.Component = {

    template : "#story-grid",
    props : ['session'],
  
    data : function(){
      return {
        stories : []
      }
    },

    // methods of the component
    methods : {
      ago : function(date){
        return moment(date * 1000).fromNow();
      }
    },

    // we watch the changes to the components' data / events
    watch : {
      '$route' : function(to, from){
        //this.loadPosts()
      }
    },

    // events of the component lifecycle

    created : function(){      
      this.stories = this.session.getProfile().stories;
      console.log(this.stories);
      
    }
};
