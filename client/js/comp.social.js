/* Social grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var SlideShow = require("./comp.slider");

var grid = {
  template: "#social-grid",
  props: ['feedback'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/social", query : { slideshow : index}});
    }
  },  
};

exports.Component = {
  template: '<component v-bind:feedback="feedback" v-bind:is="currentView"></component>',
  props: ['session', 'options'],
  data: function () {
    return {
      currentView: 'grid',
      feedback: []
    };
  },
  components: {
    grid: grid,
    //slide: SlideShow.Component
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow != undefined) {
        this.currentView = 'slide'
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
  
  created: function () {
    this.feedback = this.session.getProfile().feedback;
    this.resolveView(this.options);
  }
};