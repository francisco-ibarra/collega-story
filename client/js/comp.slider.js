/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

var Models = require("./models");
var Swiper = require("swiper");
var Vue = require("vue");

Vue.component('story-slide', {
  props : ['slide'],
  template : '<div class="swiper-slide" v-bind:style="{backgroundImage: \'url(\'+ slide.images.standard_resolution.url + \')\'}"></div>',
});

Vue.component('story-option', {
  props : ['slide'],
  template : '<div class="swiper-slide" v-bind:style="{backgroundImage: \'url(\'+ slide.images.standard_resolution.url + \')\'}"></div>',
});

exports.Component = {

    template : "#photo-slide",

    // data must be a function in components. the updates are triggered
    // automatically setting the values of this.xxxx
    data: function(){
      return {
        posts : []
      };
    },

    // methods of the component, accessbile via this.xxxx()
    methods : {
      initSlider : function(){
        /*
        var mySwiper = new Swiper('.swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: false,

            // If we need pagination
            pagination: '.swiper-pagination',

            // Navigation arrows
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',

            // And if we need scrollbar
            scrollbar: '.swiper-scrollbar',
        });
        */
        document
        .querySelector('#photoSlider')
        .addEventListener('slide', function(){
          console.log("slide moved");
        });
      },

      loadPosts : function (user){
        var self = this;
        Models.User.loadPosts(user, function(posts){
          self.posts = posts;
        });
      }
    },

    // we watch the changes to the components' data / events
    watch : {
      /*
      posts : function (val, oldVal) {
        console.log(val);
      }, */

      '$route' : function(to, from){
        // check if only the option has changed...

        this.loadPosts(this.$route.params.user)
      }
    },

    // events of the component lifecycle

    created : function(){
      this.loadPosts(this.$route.params.user);
      console.log("created slider");
    },

    updated : function(){
      this.initSlider(); // let's do it only the first time.
    }
};
