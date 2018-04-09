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

var pform = {
    template: "#photo-form",
    props: ['photos'],

    data: function(){
        return {
            currentPhoto: 0,
            photo : null
        };
    },

    methods: {
        backToSlideshow: function (index) {
            this.$router.push({ path : "/photos", query : { slideshow : this.currentPhoto}});
        }
    },

    created: function () {
        this.currentPhoto = this.$route.query.slideshow;
        this.photo = this.photos[this.currentPhoto];
    }

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
    slide: SlideShow.Component,
    pform: pform
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow != undefined) {
        if(query.showForm){
          this.currentView = 'pform';
        } else {
          this.currentView = 'slide';
        }
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