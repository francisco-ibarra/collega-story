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
  data : function(){
    return {
      sharedState : store.state,
      photos : []
    };
  }, 
  created : function(){
    console.log('photo selection created');
  }
};

var create = {
  template : '<component v-bind:is="currentView"></component>',
  props : ['session'],
  data : function(){
    return {
      sharedState : store.state,
      currentView : 'photos'
    };
  },
  components : {
    photos : photoSelect
  }
};


/* Story grid component */
var grid = {
  template: "#story-grid",
  props: ['stories'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/stories", query : { slideshow : index}});
    },
    ago : function(date){
        return moment(date * 1000).fromNow();
    }
  },  
};

exports.Component = {
    template : '<component v-bind:stories="stories" v-bind:is="currentView"></component>',
    props : ['session', 'options'],
  
    data : function(){
      return {
        currentView : 'grid',
        stories : []
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
      this.stories = this.session.getProfile().stories;
      this.resolveView(this.options);
      
    }
};
