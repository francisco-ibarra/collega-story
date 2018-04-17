/* Story grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var Vue = require("vue");
var moment = require("moment");

var Models = require("./models");

var slideMixin = require("./mixin.slider");
var SlideShow = require("./comp.slider");


/* Story creation component */

var photoSelect = {
  template: "#story-photo-select",
  props: ['photos'],

  methods: {
    selectCurrent: function (index) {
      var photo = this.photos[index];
      photo.selected = !photo.selected;

      Vue.set(this.photos, index, photo);
    },
    resetSelection: function () {
      this.photos.forEach(function (item) {
        item.selected = false;
      });
    }
  },
  created: function () {
    console.log('photo selection created');
    this.resetSelection();
  }
};

var create = {
  template: '<component v-bind:photos="photos" v-bind:account="account" v-bind:is="currentView"></component>',
  props: ['profile'],
  data: function () {
    return {
      photos: [],
      account: {
        id: ''
      },
      currentView: 'photos'
    };
  },
  components: {
    photos: photoSelect,
    slide: SlideShow.Component
  },
  watch: {
    '$route': function (to, from) {
      console.log("from create route");
      if (to.query.create == 'select') {
        this.currentView = 'photos';
      } else if (to.query.create == 'start') {
        this.prepareSession();
        this.currentView = 'slide';
      }
    }
  },

  methods: {
    prepareSession: function () {
      var photos = this.photos.filter(function (item) {
        return item.selected;
      });
      this.photos = photos;
    }
  },
  created: function () {
    this.photos = this.profile.photos;
    this.account.id = this.profile.id;
    console.log(this.profile);
  }
};

/* Story slideshow */
var slide = {
  template : '#story-slide',
  props: ['profile'],
  mixins : [slideMixin.slider.mixin, slideMixin.cards.mixin],
  
  data : function(){
    return {
      photos : [],
      //useStory: false
    };
  },
  
  methods : {
    
    onPhotoChange : function(currIndex){
      console.log(currIndex);
      var photo = this.photos[currIndex];
        this.prepareCardSet({
        id : photo.id,
        tags : photo.tags,
        images: photo.images
      });
    },

    prepareSlides: function(useStory){
      var photos = [];
      if(useStory){
          photos = this.photos.filter(function (item) {
              return item.tags.story !== '';
          });
      } else{
          photos = this.photos.filter(function (item) {
              return item.tags.story === '';
          });
      }
      this.photos = photos;
    }
  },
  
  created : function(){
    console.log("created stories slider");
    var useStory = this.$route.query.useStory;
    this.setupSlider({
      //showStory : false,
      initialPhoto : this.$route.query.slideshow
    }); // setup in data...
  
    this.setupCards({
      accountId : this.profile.id,
      useStory: useStory,
    });

    this.photos = this.profile.photos;

    this.prepareSlides(useStory);
  },

  mounted : function(){      
    this.initCards();
    this.initSlider(); // let's do it only the first time. 
  }  
};

/* Story grid component */
var grid = {
  template: "#story-grid",
  props: ['profile'],
  data: function () {
    return {
      stories: []
    };
  },
  methods: {
    openSlideShow: function (index) {
      this.$router.push({
        path: "/stories",
        query: {
          slideshow: index,
          useStory: true
        }
      });
    },
    flipCard : function(index){
      var story = this.stories[index];
      story.flipped = ! story.flipped ;
      Vue.set(this.stories, index, story);
    },
    ago: function (date) {
      return moment(date * 1000).fromNow();
    }
  },
  created: function () {
    this.stories = this.profile.stories;
  }
};

/* Story grid component */
var photoGrid = {
    template: "#no-story-grid",
    props: ['profile'],
    data: function () {
        return {
            photos: []
        };
    },
    methods: {
        openSlideShow: function (index) {
          this.$router.push({
                path: "/stories",
                query: {
                    slideshow: index,
                    useStory: false
                }
            });
        },
        preparePhotos: function(){
            var photos = this.photos.filter(function (item) {
                return item.tags.story === '';
            });
            this.photos = photos;
        }
    },
    created: function () {
      this.photos = this.profile.photos;
      this.preparePhotos();
    }

};

var choices = {
    template: "#story-menu",
    props: ['profile'],

    methods: {
        goTo : function(page,option,param){
          var query = {};
          query[option] = param;
          this.$router.push({name:page, query: query});
        }
    }
};

exports.Component = {
  template: '<component v-bind:profile="profile" v-bind:photos="photos" v-bind:is="currentView"></component>',
  props: ['session', 'options'],

  data: function () {
    return {
      //currentView: 'grid',
      currentView: 'choices',
      profile: [],
        photos: []
    };
  },

  components: {
    choices: choices,
    photoGrid: photoGrid,
    grid: grid,
    create: create,
    slide : slide
  },

  // methods of the component
  methods: {
    resolveView: function (query) {
      if (query.slideshow != undefined) {
        this.currentView = 'slide';
      } else if (query.create != undefined) {
        this.currentView = 'create';
      } else if (query.choice != undefined){
        if(query.choice == 0)
          this.currentView = 'photoGrid';
        else if(query.choice == 1){
          this.currentView = 'grid';
        }
      } else {
        this.currentView = 'choices';
      }
    },
    // this should be only loadStories
    // in future implementations
    reloadStories: function (userId, done) {
      var self = this;
      Models.User.loadProfile(userId, {
        success: function (profile) {
          self.profile = profile;
          done();
        },
        error: function (error) {
          console.log("session expired");
          self.$router.push({
            name: 'login'
          });
        }
      });
    }
  },

  watch: {
    '$route': function (to, from) {
      console.log("from stories route");
      console.log("story: checking integrity of cache");
      var self = this;
      if (this.session.isCacheDirty()) {
        this.reloadStories(this.profile.id, function () {
          self.resolveView(to.query);
        });
        console.log("story: cache dirty, reloaded.");
      } else {
        this.resolveView(to.query);
      }
    }
  },

  // lifecycle

  created: function () {
    this.profile = this.session.getProfile();
    this.photos = this.profile.photos;
    this.resolveView(this.options);
    console.log("story component created");
  }
};