/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

var Models = require("./models");
var Swiper = require("swiper");


exports.Component = {

    template : "#photo-slide",
    props : ['photos', 'options'],
    
    data: function(){
      return {        
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
      '$route' : function(to, from){
        console.log('route watch from slider')
        if (to.query.slideshow === undefined) {
          this.$router.push({name : "home"})
        }
      }
    },

    // events of the component lifecycle

    created : function(){
      console.log("created slider");
    },

    updated : function(){      
      console.log("updated slider");
      console.log(this.options);
      
      this.initSlider(); // let's do it only the first time. 
    }
};
