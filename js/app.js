/* App main file */


const routes = [
  {
    path : "/", 
    name : "home",
    component : Story.Components.Home
  },{
    path : "/session/:user", 
    name : "user",
    component : Story.Components.SlidePhotos
  },{
    path : "/session/:user/:option", 
    name : "userOption",
    component : Story.Components.SlidePhotos
  }
];

const router = new VueRouter({
  routes // short for routes: routes
})

var app = new Vue({
  router : router
}).$mount("#app");
