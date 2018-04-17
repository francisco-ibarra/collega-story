/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

var Models = require("./models");
var Swiper = require("swiper");


exports.Component = {

    template : "#photo-slide",
    props : ['photos', 'options', 'account'],
    
    data: function(){
      return {  
        initialPhoto : 0,
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
        }
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
      
        var self = this;
        
        this.slides = new Swiper('.slideshow',{
          //paginationClickable: true,
          //pagination: '.swiper-pagination',
          //initialSlide : self.initialPhoto,
          onSlideChangeEnd : function(){
            self.onPhotoChange();
          }
        });
        
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
        
        if (this.initialPhoto > 0) {
          this.slides.slideTo(this.initialPhoto,0);
        } else {
          this.onPhotoChange();
        }
        
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
      
      onPhotoChange : function(){
        var photo = this.photos[this.slides.activeIndex];
        console.log("slide changed to : " + this.slides.activeIndex);
 
        this.activePhoto.place = photo.tags.place;
        this.activePhoto.date = photo.tags.date;
        this.activePhoto.people = photo.tags.people;
        
        // this is only cached during the session.
        this.activePhoto.story = photo.tags.story;
        this.activePhoto.images = photo.images;
      },
      
      goBack : function(){
        console.log(this.$route);
        this.$router.push({name : this.$route.name});        
      },
      
      setupView : function(q){
        this.showStory = q.showStory;
        this.initialPhoto = q.slideshow;
      },

        nextCard : function(){
            //check if there are no more form elements
            if (this.galleryTop.isEnd){
                return;
            }
            //there are more, go to the next
            this.galleryTop.slideNext();
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
                story: this.activePhoto.story
            };
            console.log('photo in slider');
            console.log(photo);
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
    },

    // events of the component lifecycle

    created : function(){
      console.log("created slider");
      this.setupView(this.$route.query);
    },

    mounted : function(){      
      console.log("updated slider");
      console.log(this.options);
      
      this.initSlider(); // let's do it only the first time. 
    }
};
