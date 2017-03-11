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
    path : "/session/:user", 
    name : "user",
    component : Components.SlidePhotos
  },{
    path : "/session/:user/info",
    name : "info",
    component : Components.SlidePhotos
  }
];

const router = new VueRouter({
  routes : routes 
});

var app = new Vue({
  router : router
}).$mount("#app");
