/* Story grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var moment = require("moment");

/* Story creation component */
var store = {
  state : {
  }
};

var photoSelect = {
  template : "#story-photo-select",
  props : ['photos'],
  data : function(){
    return {
      sharedState : store.state
    };
  }, 
  created : function(){
    console.log('photo selection created');
  }
};

var create = {
  template : '<component v-bind:photos="photos" v-bind:is="currentView"></component>',
  props : ['profile'],
  data : function(){
    return {
      photos : [],
      sharedState : store.state,      
      currentView : 'photos'
    };
  },
  components : {
    photos : photoSelect
  },
  created : function(){
    this.photos = this.profile.photos;
    console.log(this.profile);
  }
};


/* Story grid component */
var grid = {
  template: "#story-grid",
  props: ['profile'],
  data : function(){
    return {
      stories : []
    };
  },
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/stories", query : { slideshow : index}});
    },
    ago : function(date){
        return moment(date * 1000).fromNow();
    }
  }, 
  created : function(){
    this.stories = this.profile.stories;    
  }  
};

exports.Component = {
    template : '<component v-bind:profile="profile" v-bind:is="currentView"></component>',
    props : ['session', 'options'],
  
    data : function(){
      return {
        currentView : 'grid',
        profile : []
      }
    },
  
    components: {
      grid: grid,
      create : create
    },
    
    // methods of the component
    methods : {
      resolveView : function(query){
        if (query.slideshow != undefined) {
          this.currentView = 'slide'
        } else if (query.create != undefined) {
          this.currentView = 'create'
        } else {
          this.currentView = 'grid'
        }
      }
    },
    
    watch : {
      '$route' : function(to, from){
        this.resolveView(to.query);
      }
    },

    // lifecycle

    created : function(){      
      this.profile = this.session.getProfile();
      this.resolveView(this.options);
      
    }
};
