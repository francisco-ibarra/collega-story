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

var describePicture = {
  template : '<h1>Hello world</h1>'
};

exports.Component = {

    template : "#photo-slide",

    // data must be a function in components. the updates are triggered
    // automatically setting the values of this.xxxx
    data: function(){
      return {
        posts : [],
        showControls : false
      };
    },

    // methods of the component, accessbile via this.xxxx()
    methods : {
      initSlider : function(){
        if (this.isSliderOn) return;
        this.isSliderOn = true;
        console.log('reloaded');
        
        document
        .querySelector('#photoSlider')
        .addEventListener('slide', function(){
          console.log("slide moved");
          //self.showControls = false;
        });
        
        this.cards = new Swiper('.photo-cards', {
         // pagination: '.swiper-pagination',
          slidesPerView: 3,
          centeredSlides: true,
          paginationClickable: true,
         // spaceBetween: 30,
          //onlyExternal : true
        });
        
        
      },

      loadPosts : function (user){
        var self = this;
        Models.User.loadPosts(user, function(posts){
          self.posts = posts;
        });
      },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
      },
      
      nextCard : function(){
        // stop propagation is done using vue properties
        
        if (this.cards.isEnd){
          this.toggleControls();
          return;
        }
        
        console.log('next card');
        this.cards.slideNext();
      },
      
      activateCard : function(){        
        if (this.cards.activeIndex == this.cards.clickedIndex)
          return;
        
        console.log('activate card : ' + this.cards.clickedIndex);
        this.cards.slideTo(this.cards.clickedIndex);
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
