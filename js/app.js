/* App main file */


const routes = [
  {path : "/", component : Story.Components.Home},
  {path : "/session/:user", component : Story.Components.SlidePhotos},
  {path : "/session/:user/:option", component : Story.Components.SlidePhotos}
];

const router = new VueRouter({
  routes // short for routes: routes
})

var app = new Vue({
  router : router
}).$mount("#app");
