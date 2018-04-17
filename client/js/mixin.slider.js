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
          //paginationClickable: true,
          //pagination: '.swiper-pagination',
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
        var path = this.$route.name;
        var query = this.$route.query;
        //by default choice is 0, goes to photoGrid
        var choice = { choice:0};
        if (path === 'stories') {
            if(query.useStory == '1'){
                choice.choice=1;
            }
            this.$router.push({name : this.$route.name, query: choice});
            return;
        }
        this.$router.push({name : this.$route.name});        
      },
      
      setupSlider : function(q){
        //this.showStory = q.showStory == '1';
        this.initialPhoto = q.initialPhoto;
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
          story : '',
          images: {
              standard: '',
              thumbnail: '',
          }
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
            slidesPerView: 1,
            onlyExternal: true
        });

        this.galleryTop = new Swiper('.gallery-top', {
            spaceBetween: 10,
        });

        this.galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: 6,
            touchRatio: 0.2,
            slideToClickedSlide: true,
        });

        this.galleryTop.params.control = this.galleryThumbs;
        this.galleryThumbs.params.control = this.galleryTop;
      },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
        this.galleryTop.slideTo(0);
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
        //check if there are no more form elements
        if (this.galleryTop.isEnd){
         return;
        }
        //there are more, go to the next
        this.galleryTop.slideNext();
      },
      
      prepareCardSet : function(photo){
        
        this.cards.slideTo(0);
 
        this.activePhoto.id = photo.id;
        this.activePhoto.place = photo.tags.place;
        this.activePhoto.date = photo.tags.date;
        this.activePhoto.people = photo.tags.people;
        
        // this is only cached during the session.
        this.activePhoto.story = photo.tags.story;
        this.activePhoto.images = photo.images;

      },

      //item indicates which of the forms fields was not remembered, set as a param in the html
      onDontKnow : function(item){
        this.activePhoto[item] = 'Non mi ricordo';
          this.saveTag();
      },

      onNoOne : function(){
          this.activePhoto.people = 'Nessuno';
          this.saveTag();
      },

      onTagSave : function(){
          alert('Dati salvati con successo');
          this.saveTag();
      },

      saveTag : function(){
          var photo = this.photos[this.slides.activeIndex];
          photo.tags = {
              place : this.activePhoto.place,
              date  : this.activePhoto.date,
              people : this.activePhoto.people,
              story: this.activePhoto.story,
          };
          Models.Photo.tag(photo.id, photo.tags, {
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
        this.accountId = q.accountId;
        this.showStory = !q.useStory;
      }
    }
};
