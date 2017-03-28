var Vue = require("vue");
var langEN= require("./lang.en");

var langOptions = {
  "en-us" : langEN,
  "it" : langEN
};

var lang = langOptions[window.navigator.language];
if (!lang){
  lang = langEN;
}

Vue.component('lang', {
  data : function (){
    return {
      Messages : lang.Messages
    };    
  },
  props : ['msg'],
  template : '<span>{{ Messages[msg] }}</span>'
  
});


exports.Messages = lang.Messages;