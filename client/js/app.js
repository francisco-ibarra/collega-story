/* App main file */
var Vue = require("vue");
var VueRouter = require("vue-router");
var Components = require("./comp");
var Models = require("./models");

const routes = [{
    path : "/login", 
    name : "login",
    component : Components.Login
  },{ 
    path : "/logout", 
    name : "logout",
    component : Components.Login
  },{    
    path : "/", 
    name : "home",
    component : Components.Home
  },{
    path : "/photos", 
    name : "photos",
    component : Components.Photos
  },{
    path : "/photos/play", 
    name : "photos.play",
    component : Components.SlidePhotos
  },{
    path : "/stories", 
    name : "stories",
    component : Components.Stories
  }  
];

var router = new VueRouter({
  routes : routes
});

router.beforeEach(function(to, from, next){
    console.log(to);
    console.log(Models.Session.isValid());
    if(!Models.Session.isValid() && to.name != "login") {
      next("login");
    } else {
      next(); 
    }
});  

var Story = new Vue({
  computed : {
    session : function(){
      return Models.Session
    }
  },
  router : router
  
}).$mount("#app");


