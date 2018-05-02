/* Social grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var slideMixin = require("./mixin.slider");

/* Social slideshow */
var slide = {
  template : '#social-slide',
  props: ['feedback'],
  mixins : [slideMixin.slider.mixin],
  created : function(){
    console.log("created"); 
  },
  methods : {
    onPhotoChange : function(){
      console.log("photo changed");
    }
  },
  mounted : function(){
    this.initSlider();
  }
};

/* Social grid component */
var grid = {
  template: "#social-grid",
  props: ['feedback','comments','likes'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/social", query : { slideshow : index}});
    },
    toDo : function(){
        alert('Spiacente. La funzionalità non è attiva in questo momento');
    }
  },
};

exports.Component = {
  template: '<component v-bind:feedback="feedback" v-bind:is="currentView" v-bind:comments="comments" v-bind:likes="likes"></component>',
  props: ['session', 'options'],
  data: function () {
    return {
      currentView: 'grid',
      feedback: [],
      comments: [],
      likes: []
    };
  },
  components: {
    grid: grid,
    slide: slide
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow !== undefined) {
        this.currentView = 'slide';
      } else {
        this.currentView = 'grid';
      }      
    },
    generateCounts : function(){
        var self = this;
        this.feedback.forEach(function(element){
          self.comments.push(Math.floor(Math.random() * Math.floor(5))+2);
          self.likes.push(Math.floor(Math.random() * Math.floor(4))+2);
        });
    }
  },
  
  watch : {
    '$route' : function(to, from){
      this.resolveView(to.query);
    }
  },  
  
  created: function () {
    //this.feedback = this.session.getProfile().feedback;
    this.feedback = this.session.getProfile().stories;
    this.resolveView(this.options);
    this.generateCounts();
  }
};