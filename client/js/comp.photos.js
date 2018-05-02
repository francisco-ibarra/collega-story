/* Photo grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var SlideShow = require("./comp.slider");
var Models = require("./models");
var Swiper = require("swiper");

var grid = {
  template: "#photo-grid",
  props: ['photos'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/photos", query : { slideshow : index}});
    }
  },  
};

var choices = {
    template: "#photo-menu",
    props: ['profile'],

    methods: {
        goTo : function(page,option,param){
            var query = {};
            query[option] = param;
            this.$router.push({name:page, query: query});
        },
        toDo : function(){
            alert('Spiacente. La funzionalità non è attiva in questo momento');
        }
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
    choices: choices,
    slide: SlideShow.Component
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow != undefined) {
        this.currentView = 'slide';
      } else if (query.add != undefined){
          this.currentView = 'choices';
      } else if (query.choice != undefined){
          if(query.choice == 0)
              this.currentView = 'photoGrid';
          else if(query.choice == 1){
              this.currentView = 'grid';
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