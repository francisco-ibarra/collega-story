/* Photo grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var SlideShow = require("./comp.slider");

var grid = {
  template: "#photo-grid",
  props: ['photos'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/photos", query : { slideshow : index}});
    }
  },  
};

exports.Component = {
  template: '<component v-bind:photos="photos" v-bind:is="currentView"></component>',
  props: ['session', 'options'],
  data: function () {
    return {
      currentView: 'grid',
      photos: []
    };
  },
  components: {
    grid: grid,
    slide: SlideShow.Component
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow != undefined) {
        this.currentView = 'slide';
      } else {
        this.currentView = 'grid';
      }      
    }
  },
  
  watch : {
    '$route' : function(to, from){
      this.resolveView(to.query);
    }
  },  
  
  created: function () {
    this.photos = this.session.getProfile().photos;
    this.resolveView(this.options);
    console.log("photos component created");
  }
};