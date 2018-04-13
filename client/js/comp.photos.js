/* Photo grid component. 
 * It allows users to browse and annotate pictures
 * @author: Marcos baez
 */

var SlideShow = require("./comp.slider");
var Swiper = require("swiper");

var grid = {
  template: "#photo-grid",
  props: ['photos'],
  methods: {
    openSlideShow: function (index) {
      this.$router.push({ path : "/photos", query : { slideshow : index}});
    }
  },  
};

var formPanel = {
    template: "#photo-form",
    props: ['photos'],

    data: function(){
        return {
            currentPhoto: 0,
            photo : null
        };
    },

    methods: {
        backToSlideshow: function (index) {
            this.$router.push({ path : "/photos", query : { slideshow : this.currentPhoto}});
        },

        initForm: function() {
            var self = this;

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
            this.photo.tags[item] = 'Non mi ricordo';
            this.nextCard();
        },

        onNoOne : function(){
            this.photo.tags.people = 'Nessuno';
            this.nextCard();
        },

        onTagSave : function(){
            alert('Dati salvati con successo');
            console.log(this.photo);
            this.nextCard();
        },
    },

    created: function () {
        this.currentPhoto = this.$route.query.slideshow;
        this.photo = this.photos[this.currentPhoto];
    },

    mounted: function () {
        this.initForm();
    }

};

exports.Component = {
  template: '<component v-bind:photos="photos" v-bind:is="currentView"></component>',
  props: ['session', 'options'],
  data: function () {
    return {
      currentView: 'grid',
      photos: []
    };
  },
  components: {
    grid: grid,
    slide: SlideShow.Component,
    formPanel: formPanel
  },
  
  methods : {
    resolveView : function(query){
      if (query.slideshow != undefined) {
        if(query.showForm){
          this.currentView = 'formPanel';
        } else {
          this.currentView = 'slide';
        }
      } else {
        this.currentView = 'grid';
      }      
    }
  },
  
  watch : {
    '$route' : function(to, from){
      this.resolveView(to.query);
    }
  },  
  
  created: function () {
    this.photos = this.session.getProfile().photos;
    this.resolveView(this.options);
    console.log("photos component created");
  }
};