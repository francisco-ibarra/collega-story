/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

// These two libraries are required in the parent
// user
var Models = require("./models");
var Swiper = require("swiper");


exports.slider = {};
exports.slider.mixin = {
    
    data: function(){
      return {  
        initialPhoto : 0
      };
    },

    methods : {
      initSlider : function(){
        if (this.isSliderOn) return;
        this.isSliderOn = true;
        var self = this;
        
        this.slides = new Swiper('.slideshow',{
          paginationClickable: true,
          pagination: '.swiper-pagination',
          //initialSlide : self.initialPhoto,
          onSlideChangeEnd : function(){            
            self.onPhotoChange(self.slides.activeIndex);
          }
        });
        
        
        if (this.initialPhoto > 0) {
          this.slides.slideTo(this.initialPhoto,0);
        } else {
          this.onPhotoChange(this.slides.activeIndex);
        }
        
      },   
      
      goBack : function(){
        console.log(this.$route);
        this.$router.push({name : this.$route.name});        
      },
      
      setupSlider : function(q){
        this.showStory = q.showStory == '1';        
        this.initialPhoto = q.slideshow;
      }
    }

};


exports.cards = {};
exports.cards.mixin = {
    
    data: function(){
      return {  
        showControls : false,
        showStory : false,
        
        tagControlEnabled : false,
        storyControlEnabled : false,        
        
        activePhoto : {
          date : '',
          people : '',
          place : '',
          story : ''
        },
        accountId : null
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

    // methods of the component, accessbile via 
    methods : {
      initCards : function(){
        if (this.isCardOn) return;
        this.isCardOn = true;
        
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
      
      prepareCardSet : function(photo){
        
        this.cards.slideTo(0);
 
        this.activePhoto.id = photo.id;
        this.activePhoto.place = photo.tags.place;
        this.activePhoto.date = photo.tags.date;
        this.activePhoto.people = photo.tags.people;
        
        // this is only cached during the session.
        this.activePhoto.story = photo.tags.story;
      },    
      
      onTagSave : function(){
        var tags = {
          place : this.activePhoto.place,
          date  : this.activePhoto.date,
          people : this.activePhoto.people
        };
        
        Models.Photo.tag(this.activePhoto.id, tags, {
          success : function(){
            console.log("tagsave: saved tag");
          },
          error : function(){
            console.log("tagsave: error tagging");
          }
        });
        this.nextCard();        
      },
      
      onStorySave: function () {
        
        var story = {
          photo: { 
            id : this.activePhoto.id
          },
          story: this.activePhoto.story,
          from: {
            id : this.accountId
          }
        };
        
        Models.Photo.createStory(story, {
          success : function(){
            console.log("storysave: saved story");
          },
          error : function(){
            console.log("storysave: error saving");
          }
        });
        
        // TODO: add story to photo?>>>
        photo.tags.story = story.story;
        this.toggleControls();        
      },
      
      setupCards : function(q){
        this.accountId = q.accountId
      }
    }
};
