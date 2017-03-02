/* App main file */
var Vue = require("vue");
var VueRouter = require("vue-router");
var Components = require("./comp");
var Models = require("./models");

// passing url parameters to the 
// components (this.options)
var passQueryProp = function(route){
  return { options : route.query};
};

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
    component : Components.Photos,
    props : passQueryProp
  },{
    path : "/stories", 
    name : "stories",
    component : Components.Stories
  },{
    path : "/social", 
    name : "social",
    component : Components.Social,
    props : passQueryProp    
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


