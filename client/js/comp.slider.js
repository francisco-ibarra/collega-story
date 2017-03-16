/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

var Models = require("./models");
var Swiper = require("swiper");

exports.Component = {

    template : "#photo-slide",

    data: function(){
      return {
        showControls : false,
        sessionEnd : false,

        posts: [],

        //username: null,
        whereKnown : null,
        whereNotes : null,
        whenKnown: null,
        whenNotes : null,
        whoKnown: null,
        whoNotes : null,
        story : null
      };
    },

    methods : {
      initSlider : function(){
        if (this.isSliderOn) return;
        this.isSliderOn = true;
        console.log('reloaded');

        var self = this;

        this.slides = new Swiper('.slideshow', {
            paginationClickable: true,
            pagination: '.swiper-pagination',
            onSlideChangeStart: function(){
                console.log('slide changed');
                if(self.showControls){
                    self.toggleControls();
                }
            },
            onSlideChangeEnd: function(){
                if(self.slides.isEnd){
                    self.sessionEnd = true;
                } else {
                    self.sessionEnd = false;
                    self.cards.slideTo(0);
                    //load form with store data
                    self.whereNotes = self.posts[self.slides.activeIndex].whereNotes;
                    self.whereKnown = self.posts[self.slides.activeIndex].whereKnown;
                    self.whenNotes = self.posts[self.slides.activeIndex].whenNotes;
                    self.whenKnown = self.posts[self.slides.activeIndex].whenKnown;
                    self.whoNotes = self.posts[self.slides.activeIndex].whoNotes;
                    self.whoKnown = self.posts[self.slides.activeIndex].whoKnown;
                    self.story = self.posts[self.slides.activeIndex].story;
                }
            }
        });

        //add slide with ending message
        this.slides.appendSlide(
            '<div class="swiper-slide" style="background:white">' +
                '<div class="content-padded">' +
                    '<h4>Well done! That was your last picture</h4>' +
                    '<div style="margin-bottom:10px">Please tap on Submit data at the bottom to finish the session</div>' +
                    '<div style="margin-bottom:10px">Thanks for participating!</div>' +
                '</div>' +
            '</div>'
        );

        this.cards = new Swiper('.tagControls', {
            slidesPerView: 3,
            centeredSlides: true,
            paginationClickable: true
        });

      },

      loadPosts : function (user){
        var self = this;
        Models.User.loadPosts(user, function(posts){
            posts.forEach(function(element){
                //initialize post information
                var post = {
                    user : element.user.username,
                    url : element.link,
                    images: element.images,
                    whereKnown : null,
                    whereNotes : null,
                    whenKnown : null,
                    whenNotes : null,
                    whoKnown : null,
                    whoNotes : null,
                    story : null
                };
                //load post array for slideshow
                self.posts.push(post);
            });
          self.username = user;
        });
      },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
      },

        submitData: function(){

            Models.User.SavePostInfo(this.username, this.posts, {
                success: function(){
                    console.log('information saved');
                },
                error: function(){
                    console.log('error');
                }
            });
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

      whereUnknown: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whereKnown = false;
          this.posts[this.slides.activeIndex].whereNotes = "";
      },

      whereSave: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whereNotes = this.whereNotes;
          this.posts[this.slides.activeIndex].whereKnown = true;
      },

      whenUnknown: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whenKnown = false;
          this.posts[this.slides.activeIndex].whenNotes = "";
      },

      whenSave: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whenNotes = this.whenNotes;
          this.posts[this.slides.activeIndex].whenKnown = true;
      },

      whoUnknown: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whoKnown = false;
          this.posts[this.slides.activeIndex].whoNotes = "";
      },

      whoSave: function(e){
          e.preventDefault();
          this.posts[this.slides.activeIndex].whoNotes = this.whoNotes;
          this.posts[this.slides.activeIndex].whoKnown = true;
      },

        storySave: function(e){
            e.preventDefault();
            this.posts[this.slides.activeIndex].story = this.story;
            //reposition cards and go to next slide
            this.cards.slideTo(0);
            this.slides.slideNext();
        }

    },

    // events of the component lifecycle
    created : function(){
      this.loadPosts(this.$route.params.user);
      console.log("slider created");
    },

    updated : function(){
        console.log("slider updated");
        this.initSlider(); // let's do it only the first time.
    }
};
