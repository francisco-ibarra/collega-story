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
        showTags : false,
        
        tagControlEnabled : false,
        storyControlEnabled : false,
        activateStory: true,
        
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
      },
      tagsAvailable : function(){
        return this.activePhoto.date || this.activePhoto.people || this.activePhoto.place;
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

        var titles = ['DOVE', 'QUANDO', 'CHI'];

        this.swiperForm = new Swiper('.swiper-form', {
            spaceBetween: 10,
            pagination: '.grid-form .swiper-pagination',
            paginationClickable: true,
            paginationBulletRender: function (swiper, index, className) {
                return '<span class="' + className + '">' + titles[index] + '</span>';
            }
        });
        
        if (this.initialPhoto > 0) {
          this.slides.slideTo(this.initialPhoto,0);
        } else {
          this.onPhotoChange();
        }
        
      },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
        this.swiperForm.slideTo(0);
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

        toggleStory : function(){
            this.activateStory = !this.activateStory;
        },

        toggleTags : function(){
          this.showTags = !this.showTags;
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
            if (this.swiperForm.isEnd){
                return;
            }
            this.swiperForm.slideNext();
        },

        //item indicates which of the forms fields was not remembered, set as a param in the html
        onDontKnow : function(item){
            this.activePhoto[item] = 'Non mi ricordo';
        },

        onNoOne : function(){
            this.activePhoto.people = 'Nessuno';
        },

        onTagSave : function(object){
          //If any tag field is left empty
          if (object === 'tags'){
              if(!this.activePhoto.place || !this.activePhoto.date || !this.activePhoto.people){
                  if(!this.activePhoto.place && !this.activePhoto.date && !this.activePhoto.people){
                      alert('Riprova. Non sono stati inseriti dati');
                  } else{
                      if (confirm("Ci sono campi vuoti. Vuoi salvare i dati lo stesso?")) {
                          this.saveTag('tags');
                      }
                  }
              } else {
                  this.saveTag('tags');
              }
          } else if (object === 'story'){
              if(!this.activePhoto.story){
                  alert('Riprova. Non sono stati inseriti dati');
              } else {
                  this.saveTag('story');
              }
          }

        },

        saveTag : function(object){
          var self= this;
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
                    alert("Dati salvati con successo");
                    self.toggleControls();
                    if(object === 'tags'){
                        if(!self.showTags){
                            self.toggleTags();
                        }
                        //hide stories
                        if(self.activateStory){
                            self.toggleStory();
                        }
                    } else if(object === 'story'){
                        if(!self.activateStory){
                            self.toggleStory();
                        }
                        //hide tags
                        if(self.showTags){
                            self.toggleTags();
                        }
                    }
                },
                error : function(){
                    console.log("tagsave: error tagging");
                }
            });
            //this.nextCard();
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
