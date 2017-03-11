/* SlidePhoto component. 
 * It allows users to browse and annotate pictures
 */

var Models = require("./models");
var Swiper = require("swiper");

exports.Component = {

    template : "#photo-slide",
    // data must be a function in components. the updates are triggered
    // automatically setting the values of this.xxxx
    data: function(){
      return {
        showControls : false,
        tagControlEnabled : false,
        storyControlEnabled : false,
        posts: [],

        username: null,
        whereKnown : null,
        whereNotes : null,
        whenKnown: null,
        whenNotes : null,
        whoKnown: null,
        whoNotes : null,
        story : null
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

        this.slides = new Swiper('.slideshow', {
            paginationClickable: true,
            pagination: '.swiper-pagination',
            onSlideChangeStart: function(){
                console.log('slide changed');
                if(self.showControls){
                    self.toggleControls();
                }
            }
        });

        this.cards = new Swiper('.tagControls', {
            slidesPerView: 3,
            centeredSlides: true,
            paginationClickable: true
        });

      },

      loadPosts : function (user){
        var self = this;
        Models.User.loadPosts(user, function(posts){
          self.posts = posts;
          self.username = user;
        });
      },

        sendPostInfo: function(){
          var postUrl = this.posts[this.slides.activeIndex-1].link;
          var post = {
              user : this.username,
              url : postUrl,
              whereKnown : this.whereKnown,
              whereNotes : this.whereNotes,
              whenKnown : this.whenKnown,
              whenNotes : this.whenNotes,
              whoKnown : this.whoKnown,
              whoNotes : this.whoNotes,
              story : this.story
          };

          Models.User.SavePostInfo(this.username, post, {
             success: function(){
                 console.log('information saved');
             },
              error: function(){
                 console.log('error');
              }
          });
        },

        clearPostData: function(){
            this.whereKnown = null;
            this.whereNotes = null;
            this.whenKnown= null;
            this.whenNotes= null;
            this.whoKnown= null;
            this.whoNotes= null;
            this.story= null;
        },
      
      toggleControls : function(event){
        console.log('toggle event');
        this.showControls = !this.showControls;
      },

        toggleCurrentControl : function(current){
            if(current == 'story'){
                if(this.showControls && this.storyControlEnabled){
                    this.showControls = false;
                }
                if(!this.showControls && !this.storyControlEnabled){
                    this.showControls = true;
                }
                this.storyControlEnabled = !this.storyControlEnabled;
                this.tagControlEnabled = false;
            } else {
                if(this.showControls && this.tagControlEnabled){
                    this.showControls = false;
                }
                if(!this.showControls && !this.tagControlEnabled){
                    this.showControls = true
                }
                this.tagControlEnabled = !this.tagControlEnabled;
                this.storyControlEnabled = false;
            }
        },

        toggleDone: function(){
            if(this.slides.isEnd){
                console.log('No more slides');
            } else {
                console.log('Move to next slide');
                this.clearPostData();
                this.cards.slideTo(0);
                this.slides.slideNext();
                this.sendPostInfo();
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

      whereUnknown: function(e){
          e.preventDefault();
          this.whereKnown = false;
          this.whereNotes = "";
      },

      whereSave: function(e){
          e.preventDefault();
          this.whereKnown = true;
      },

      whenUnknown: function(e){
          e.preventDefault();
          this.whenKnown = false;
          this.whenNotes = "";
      },

      whenSave: function(e){
          e.preventDefault();
          this.whenKnown = true;
      },

      whoUnknown: function(e){
          e.preventDefault();
          this.whoKnown = false;
          this.whoNotes = "";
      },

      whoSave: function(e){
          e.preventDefault();
          this.whoKnown = true;
      },

        storySave: function(e){
            e.preventDefault();
            this.toggleControls();
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
