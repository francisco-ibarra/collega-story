/* App main file */
var Vue = require("vue");
var VueRouter = require("vue-router");
var Components = require("./comp");

const routes = [
  {
    path : "/", 
    name : "home",
    component : Components.Home
  },{
    path : "/photos/:user", 
    name : "photos",
    component : Components.Photos
  },{
    path : "/session/:user", 
    name : "user",
    component : Components.SlidePhotos
  },{
    path : "/session/:user/:option", 
    name : "userOption",
    component : Components.SlidePhotos
  },{
    path : "/stories/:user", 
    name : "stories",
    component : Components.Photos
  }  
];

const router = new VueRouter({
  routes : routes 
})

var app = new Vue({
  router : router
}).$mount("#app");
