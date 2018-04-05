var Vue = require("vue");
var langEN= require("./lang.en");
var langIT= require("./lang.it");

var langOptions = {
  "en-us" : langEN,
  "it" : langIT
};

var userLang = window.navigator.languages?
  window.navigator.languages[0]:
  window.navigator.language;

var lang = langOptions[userLang];
if (!lang){
  //make italian the default language
  lang = langIT;
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