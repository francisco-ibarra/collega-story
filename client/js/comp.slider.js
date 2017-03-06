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
        showControls : false,
        tagControlEnabled : false,
        storyControlEnabled : false,
        
        showStory : false
      };
    },
  
    computed : {
      tagControlOn : function(){
        return this.showControls && this.tagControlEnabled;
      },
      storyControlOn : function(){
        return this.showControls && this.storyControlEnabled;
      }
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
        
        this.cards = new Swiper('.tagControls', {
          slidesPerView: 3,
          centeredSlides: true,
          paginationClickable: true
        });        
      },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
      },
      
      toggleCurrentControl : function(current){
        this.showControls = true;
        if (current == 'story'){                    
          this.tagControlEnabled = false;
          this.storyControlEnabled = true;
        } else {          
          this.storyControlEnabled = false;
          this.tagControlEnabled = true;
        }                              
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
      },
      
      goBack : function(){
        console.log(this.$route);
        this.$router.push({name : this.$route.name});        
      },
      
      setupView : function(q){
        this.showStory = q.showStory == '1';
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
      this.setupView(this.$route.query);
    },

    updated : function(){      
      console.log("updated slider");
      console.log(this.options);
      
      this.initSlider(); // let's do it only the first time. 
    }
};
