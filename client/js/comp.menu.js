/* Home component. 
   It prompts the instagram account to the user 
*/

var Models = require("./models");

exports.Component = {

  template: "#page-home",

  props : ['posts'],
  
  methods : {
    
    goTo : function(page){
      this.$router.push({ name: page});
    }
  },
  
  created : function(){
    console.log(this.posts);
  }  
};