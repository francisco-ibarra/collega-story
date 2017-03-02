/* Photo grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

exports.Component = {

    template : "#photo-grid",
    props : ['session'],
  
    data : function(){
      return {
        photos : []
      }
    },

    // methods of the component
    methods : {
      goBack : function(){
        this.$router.push({name : 'home'});
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
      this.photos = this.session.getProfile().photos;
      console.log(this.session);
    }
};
