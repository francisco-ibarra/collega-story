/* Story grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */
var SlideShow = require("./comp.slider");
var moment = require("moment");
var Vue = require("vue");

/* Story creation component */

var photoSelect = {
  template : "#story-photo-select",
  props : ['photos'],
 
  methods : {
    selectCurrent : function(index){
      var photo = this.photos[index];
      photo.selected = !photo.selected;
      
      Vue.set(this.photos, index, photo);
    }, 
    resetSelection : function(){          
      this.photos.forEach(function(item){
        item.selected = false;
      });
    }
  },
  created : function(){
    console.log('photo selection created');
    this.resetSelection();
  }
};

var create = {
  template : '<component v-bind:photos="photos" v-bind:account="account" v-bind:is="currentView"></component>',
  props : ['profile'],
  data : function(){
    return {
      photos : [],     
      account : {
        id : ''
      },
      currentView : 'photos'
    };
  },
  components : {
    photos : photoSelect,
    slide : SlideShow.Component
  },
  watch : {
    '$route' : function(to, from){
      console.log("from create route");
      if (to.query.create == 'select'){
        this.currentView = 'photos';
      } else if (to.query.create == 'start'){  
        this.prepareSession();
        this.currentView = 'slide';
      }
    }
  },
  
  methods : {
    prepareSession : function(){
      var photos = this.photos.filter(function(item){
        return item.selected;
      });
      this.photos = photos;
    }
  },
  created : function(){
    this.photos = this.profile.photos;
    this.account.id = this.profile.id;
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
        console.log("from stories route");
      }
    },

    // lifecycle

    created : function(){      
      this.profile = this.session.getProfile();
      this.resolveView(this.options);
      
    }
};
